import { io, type Socket } from 'socket.io-client';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as syncProtocol from 'y-protocols/sync';
import * as authProtocol from 'y-protocols/auth';
import {
  applyAwarenessUpdate,
  Awareness,
  encodeAwarenessUpdate,
  removeAwarenessStates
} from 'y-protocols/awareness';
import * as Y from 'yjs';

// These are message types, specified in the `y-protocols` package
export enum MsgType {
  Sync = 0,
  Awareness = 1,
  Auth = 2,
  QueryAwareness = 3
}

// When constructing a YJS client, create a Y.Doc with a GUID corresponding to the
// document you want to watch / the sessionId you want to join.
export class YjsProvider extends EventTarget {
  private serverUrl: string;
  private token?: string | null;

  private _doc: Y.Doc;
  private _awareness: Awareness;

  private socket: Socket | null = null;

  private aggregatedUpdate: Uint8Array | null = null;
  private updateTimer: number | NodeJS.Timeout | null = null;

  constructor(serverUrl: string, token?: string | null, doc?: Y.Doc, awareness?: Awareness) {
    super();
    this.serverUrl = serverUrl.replace(/\/+$/, ''); // Ensure the URL doesn't end with /
    this.token = token;

    this._doc = doc ?? new Y.Doc();
    this._awareness = awareness ?? new Awareness(this._doc);
    this.handleNewDoc();
  }

  private handleNewDoc = () => {
    // Cleanup handler for node.js
    if (typeof process !== 'undefined' && process.env.isNode) {
      process.on('exit', this.exitHandler);
    }

    // Watch for updates to our local Y-doc
    this.addListeners();

    // automatically attempt to connect
    this.connect(this.serverUrl);

    this.dispatchEvent(new CustomEvent('new_doc', { detail: { guid: this._doc.guid } }));
  };

  // External getters
  public get doc(): Y.Doc {
    return this._doc;
  }

  public get awareness(): Awareness {
    return this._awareness;
  }

  // This disconnects from the server and then reconnects with a new doc-id
  changeDoc = (doc?: Y.Doc, awareness?: Awareness) => {
    this.destroy();

    this._doc = doc ?? new Y.Doc();
    this._awareness = awareness ?? new Awareness(this._doc);
    this.handleNewDoc();
  };

  connect = (serverUrl?: string, token?: string | null) => {
    if (
      this.socket &&
      this.socket.connected &&
      (serverUrl === undefined || serverUrl === this.serverUrl)
    ) {
      return; // we have an existing connection to this server already
    } else {
      this.disconnect(); // remove existing connection
    }

    if (serverUrl) this.serverUrl = serverUrl.replace(/\/+$/, '');
    if (token) this.token = token;

    try {
      this.socket = io(this.serverUrl, {
        ...(this.token ? { query: { token: this.token } } : {}),
        autoConnect: true,
        reconnection: true
      });
    } catch (e) {}

    // Connect handler
    this.socket?.on('connect', () => {
      this.dispatchEvent(new CustomEvent('status', { detail: { status: 'connected' } }));
      this.connectHandler();
    });

    // Message handler
    this.socket?.on('message', (data: ArrayBuffer) => {
      const message = new Uint8Array(data);
      const encoder = encoding.createEncoder();
      const decoder = decoding.createDecoder(message);
      const msgType = decoding.readVarUint(decoder) as MsgType;

      switch (msgType) {
        // Server or another client sent us a state-update
        case MsgType.Sync:
          // For message types sync-step2 and sync-update, this will apply the received upate
          // to our local yDoc.
          // For message type sync-step1, no update will be applied; this is a request for
          // us to encode our current state as an update, written to our `encoder`, which we
          // will send back to the server.
          syncProtocol.readSyncMessage(decoder, encoder, this._doc, null);
          break;

        // Another client is asking us to provide our awareness state
        case MsgType.QueryAwareness:
          encoding.writeVarUint(encoder, MsgType.Awareness);
          encoding.writeVarUint8Array(
            encoder,
            encodeAwarenessUpdate(this._awareness, Array.from(this._awareness.getStates().keys()))
          );
          break;

        // Server or another client sent an update to awareness state
        case MsgType.Awareness:
          const update = decoding.readVarUint8Array(decoder);
          applyAwarenessUpdate(this._awareness, update, null);
          break;

        // Authentication message from the y-protocol
        case MsgType.Auth:
          authProtocol.readAuthMessage(decoder, this._doc, (_ydoc, reason) =>
            console.warn(`Permission denied to access: \n ${reason}`)
          );
          break;

        default:
          console.error('Unknown message type:', MsgType);
      }

      // Sync-step 1 requires us to reply with a state-vector, and query-awareness
      // requires us to reply with a complete query-state.
      if (encoding.length(encoder) > 1) {
        this.socket!.emit('message', encoding.toUint8Array(encoder));
      }
    });

    // Logs errors from socket.io
    this.socket?.on('error', (error: unknown) => {
      // console.error('Socket.IO error: ', error);
      this.dispatchEvent(new CustomEvent('connection-error', { detail: { error } }));
    });
    this.socket?.on('connect_error', (error: unknown) => {
      // console.error('Socket.IO connection error: ', error);
      this.dispatchEvent(new CustomEvent('connection-error', { detail: { error } }));
    });
    this.socket?.on('reconnect_error', (error: unknown) => {
      // console.error('Socket.IO reconnection error: ', error);
      this.dispatchEvent(new CustomEvent('reconnection-error', { detail: { error } }));
    });

    // The reconnect-websocket library will try to reconnect automatially after this
    this.socket?.on('disconnect', () => {
      this.dispatchEvent(new CustomEvent('connection-close'));

      // Stop sending updates to the server
      if (this.updateTimer) clearInterval(this.updateTimer);
    });
  };

  disconnect = () => {
    if (this.socket === null) return; // No need to do anything

    // Send message with local awareness state set to null (indicating disconnect)
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MsgType.Awareness);
    encoding.writeVarUint8Array(
      encoder,
      encodeAwarenessUpdate(this._awareness, [this._doc.clientID], new Map())
    );
    this.socket.emit('message', encoding.toUint8Array(encoder));

    // Close Websocket
    this.socket.close();
    this.socket = null;

    this.dispatchEvent(new CustomEvent('status', { detail: { status: 'disconnected' } }));
  };

  destroy = () => {
    this._doc.destroy();
    this._awareness.destroy();

    if (typeof process !== 'undefined' && process.env.isNode) {
      process.off('exit', this.exitHandler);
    }

    this.removeListeners();
    this.disconnect();
  };

  private addListeners = () => {
    this._doc.on('update', this.localUpdateHandler);
    this._awareness.on('update', this.awarenessUpdateHandler);
  };

  // Remove update listeners
  private removeListeners = () => {
    this._doc.off('update', this.localUpdateHandler);
    this._awareness.off('update', this.awarenessUpdateHandler);
  };

  // Fires whenever we first connect or change graphs
  private connectHandler = () => {
    // Specify which graph we are syncing
    this.socket?.emit('watchGraph', this._doc.guid);

    // Send initial sync message
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MsgType.Sync);
    syncProtocol.writeSyncStep1(encoder, this._doc);
    this.socket?.emit('message', encoding.toUint8Array(encoder));

    // Optionally; send initial awareness message
    const awarenessUpdate = encodeAwarenessUpdate(this._awareness, [this._doc.clientID]);
    const encoderAwareness = encoding.createEncoder();
    encoding.writeVarUint(encoderAwareness, MsgType.Awareness);
    encoding.writeVarUint8Array(encoderAwareness, awarenessUpdate);
    this.socket?.emit('message', encoding.toUint8Array(encoderAwareness));

    // Start sending updates up to the server regularly
    if (this.updateTimer) clearInterval(this.updateTimer);
    this.updateTimer = setInterval(() => {
      this.sendUpdates();
    }, 50); // Debounce interval of 50ms
  };

  // Accumulates updates, sending them periodically
  private localUpdateHandler = (update: Uint8Array, origin: YjsProvider | string) => {
    if (origin === this) {
      // aggregate our our local updates to be sent up to the websocket-server
      this.aggregatedUpdate = this.aggregatedUpdate
        ? Y.mergeUpdates([this.aggregatedUpdate, update])
        : update;
    } else {
      // dispatch an event locally for updates not caused by us
      this.dispatchEvent(new CustomEvent('update', { detail: { update } }));
    }
  };

  // Sends updates to our local-doc to the remote server, if we're connected
  private sendUpdates = () => {
    if (this.aggregatedUpdate === null) return; // no updates to send
    if (!this.socket || !this.socket.connected) return; // no connection to use

    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MsgType.Sync);
    syncProtocol.writeUpdate(encoder, this.aggregatedUpdate);

    this.socket.emit('message', encoding.toUint8Array(encoder));

    this.aggregatedUpdate = null; // clear aggregated update
  };

  // Sends updates to our awareness information to the server, if we're connected
  private awarenessUpdateHandler = (
    { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
    _origin: string | YjsProvider
  ) => {
    if (!this.socket || !this.socket.connected) return; // no connection to use

    const changedClients = added.concat(updated).concat(removed);
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, MsgType.Awareness);
    encoding.writeVarUint8Array(encoder, encodeAwarenessUpdate(this._awareness, changedClients));
    this.socket.emit('message', encoding.toUint8Array(encoder));
  };

  private exitHandler = () => {
    removeAwarenessStates(this._awareness, [this._doc.clientID], 'app closed');
  };
}

// ===== Example usage =====

// fetch the existing sessionId, if it exists
// const graphId: string | undefined = '1234';

// Create a Yjs document.
// If session-id does not exist, this will be a new empty document, rather than an existing
// one.
// An internal Client-id will also be generated; this is used for the awareness protocol.
// const doc = new Y.Doc({ guid: graphId });

// const firebaseAuthToken = localStorage.getItem('firebaseAuthToken');

// const provider = new YjsProvider('ws://localhost:1234/', firebaseAuthToken, doc);
