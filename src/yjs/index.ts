import { Doc } from 'yjs';
import { HistoryMap } from '../types';

export const yDoc = new Doc();

export const graphHistory = yDoc.getMap<HistoryMap>('history');
