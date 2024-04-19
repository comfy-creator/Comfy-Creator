import * as Y from 'yjs';
import { YjsProvider } from './client';
import { NodeState } from '../lib/types.ts';
import type { Edge, Node } from 'reactflow';
import { ComfyLocalStorage } from '../lib/localStorage.ts';

// TO DO: load this from .env
const CONNECT_URL = 'http://localhost:8000';

// TODO: fetch a local graphId from local storage, if it exists
let graphId = ComfyLocalStorage.getItem('graphId');
if (!graphId) {
  graphId = crypto.randomUUID();
  ComfyLocalStorage.setItem('graphId', graphId);
}

console.log({ graphId });
const firebaseAuthToken = ComfyLocalStorage.getItem('firebaseAuthToken');

// If a pre-existing graphId does not exist, this will remain a new (empty) document,
// otherwise the server may be able to load an existing document from a Pulsar topic.
//
// An internal doc.clientId will also be generated; this is used for the
// awareness protocol.
export const yjsProvider = new YjsProvider(
  CONNECT_URL,
  firebaseAuthToken,
  new Y.Doc({ guid: graphId })
);

// TO DO: these will have to be recreated when we switch graphs-ids
const yNodes = yjsProvider.doc.getMap<Node<NodeState>>('nodes');
const yEdges = yjsProvider.doc.getMap<Edge>('edges');

// TO DO: we may need to specify `trackedOrigins` ?
export const undoManager = new Y.UndoManager([yNodes, yEdges], { captureTimeout: 1000 });

// NOTE: if you call yjsProvider.changeDoc(), the undoManager and Zustand State
// will still refer to the _old_ yDoc, not the new yDoc.