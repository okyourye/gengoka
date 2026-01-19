
import Dexie, { type EntityTable } from 'dexie';

interface TrainingSession {
    id: number;
    theme: string;
    step1_thought: string;
    step2_reason: string;
    createdAt: Date;
}

const db = new Dexie('GengokaDB') as Dexie & {
    trainings: EntityTable<TrainingSession, 'id'>;
};

// Schema definition
db.version(1).stores({
    trainings: '++id, theme, createdAt' // Primary key and indexed props
});

export type { TrainingSession };
export { db };
