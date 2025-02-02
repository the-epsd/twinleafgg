import 'reflect-metadata';
import { EntityManager } from 'typeorm';
export declare class Storage {
    private connection;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get manager(): EntityManager;
}
