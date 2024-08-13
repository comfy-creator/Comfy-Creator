import { INDEX_DB_NAME, INDEX_DB_OJECT_NAME } from '../config/constants';
import { AppNode } from '../types/types';
import { Edge } from '@xyflow/react';

export interface IGraphData {
   index: string;
   label: string;
   nodes: AppNode[];
   edges: Edge[];
}

export interface IGraphRun {
   index: string;
   label: string;
   nodes: AppNode[];
   edges: Edge[];
}

// db.ts

let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;

export const initDB = (): Promise<boolean> => {
   return new Promise((resolve) => {
      // open the connection
      request = indexedDB.open(INDEX_DB_NAME);

      request.onupgradeneeded = () => {
         db = request.result;

         // if the data object store doesn't exist, create it
         db.createObjectStore(INDEX_DB_OJECT_NAME);
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
   if (db) {
      const transaction = db?.transaction(INDEX_DB_OJECT_NAME, 'readwrite');
      const objectStore = transaction?.objectStore(INDEX_DB_OJECT_NAME);
      const transactionRequest = objectStore?.put(value, key) as IDBRequest<IDBValidKey>;

      transactionRequest.onsuccess = (event: Event) => {};

      transactionRequest.onerror = (event: Event) => {
         console.log('Error: ' + (event.target as IDBRequest).error);
      };
   }
};

const getItem = (key: string) => {
   return new Promise(async (resolve, reject) => {
      if (db) {
         const transaction = db?.transaction(INDEX_DB_OJECT_NAME, 'readonly');
         const objectStore = transaction?.objectStore(INDEX_DB_OJECT_NAME);
         const transactionRequest = objectStore?.get(key) as IDBRequest<any>;

         transactionRequest.onsuccess = (event: Event) => {
            const result = (event.target as IDBRequest).result;
            if (result) {
               resolve(result);
            } else {
               resolve(null);
            }
         };

         transactionRequest.onerror = (event: Event) => {
            console.log('Error: ' + (event.target as IDBRequest).error);
            reject((event.target as IDBRequest).error);
         };
      } else {
         resolve(null);
      }
   });
};

const DB = { getItem, setItem };

export default DB;
