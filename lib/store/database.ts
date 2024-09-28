import Dexie, { type EntityTable } from 'dexie';
import { AppNode } from '../types/types';
import { Edge } from '@xyflow/react';

export interface IGraphData {
   id: string;
   label: string;
   nodes: AppNode[];
   edges: Edge[];
}

export interface IGraphSnapshot {
   id: string;
   label: string;
   nodes: AppNode[];
   edges: Edge[];
}

export interface IGraphConfig {
   id: string;
   currentGraphId: string;
   currentSnapshotId: string;
}

const Database = new Dexie('Graph') as Dexie & {
   graphs: EntityTable<IGraphData, 'id'>;
   snapshots: EntityTable<IGraphSnapshot, 'id'>;
   config: EntityTable<IGraphConfig, 'id'>;
};

// Schema declaration:
Database.version(1).stores({
   graphs: '++id',
   snapshots: '++id',
   config: '++id'
});

Database.on('populate', async () => {
   await Database.config.add({ id: 'config', currentGraphId: '', currentSnapshotId: '' });
   await Database.graphs.add({ id: 'default', label: 'Default', nodes: [], edges: [] });
});

export { Database };