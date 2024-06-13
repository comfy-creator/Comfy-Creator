import { INDEX_DB_NAME, INDEX_DB_OJECT_NAME } from '../config/constants';
import { NodeData } from '../types/types';
import { Edge, Node } from 'reactflow';

export interface IGraphData {
  index: string;
  label: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
}

export interface IGraphRun {
  index: string;
  label: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
}

// db.ts

let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;

export enum Stores {
  Graphs = 'graphs',
  Runs = 'runs'
}

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection
    request = indexedDB.open(INDEX_DB_NAME);

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it

      (Object.keys(Stores) as Array<keyof typeof Stores>).map((key) => {
        if (!db.objectStoreNames.contains(Stores[key])) {
          db.createObjectStore(Stores[key], { keyPath: 'index' });
        }
      });
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      console.log('request.onsuccess - initDB', version);
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

const setItem = (key: string, value: any) => {
  const transaction = db?.transaction(INDEX_DB_OJECT_NAME, 'readwrite');
  const objectStore = transaction?.objectStore(INDEX_DB_OJECT_NAME);
  const request = objectStore?.put({ key, value }) as IDBRequest<IDBValidKey>;

  request.onsuccess = (event: Event) => {};

  request.onerror = (event: Event) => {
    console.log('Error: ' + (event.target as IDBRequest).error);
  };
};

const getItem = (key: string) => {
  return new Promise(async (resolve, reject) => {
    const transaction = db?.transaction(INDEX_DB_OJECT_NAME, 'readonly');
    const objectStore = transaction?.objectStore(INDEX_DB_OJECT_NAME);
    const request = objectStore?.get(key) as IDBRequest<any>;

    request.onsuccess = (event: Event) => {
      const result = (event.target as IDBRequest).result;
      if (result) {
        resolve(result.value);
      } else {
        resolve(null);
      }
    };

    request.onerror = (event: Event) => {
      console.log('Error: ' + (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };
  });
};

const DB = { getItem, setItem };

export default DB;
