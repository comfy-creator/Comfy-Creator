import Y from 'yjs';
import { YjsProvider } from './client';
import { HistoryMap } from '../types';

// export const graphHistory = yDoc.getMap<HistoryMap>('history');

// TO DO: load this from .env
const CONNECT_URL = 'ws://localhost:1234/';

// TO DO: fetch a local graphId from local storage, if it exists
const graphId: string | undefined = '1234';

const firebaseAuthToken = localStorage.getItem('firebaseAuthToken');

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
