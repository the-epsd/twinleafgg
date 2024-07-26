"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const model_1 = require("./model");
class Storage {
    constructor() {
        this.connection = null;
    }
    async connect() {
        const storageConfig = {
            type: process.env.STORAGE_TYPE,
            host: process.env.STORAGE_HOST,
            port: process.env.STORAGE_PORT,
            username: process.env.STORAGE_USERNAME,
            password: process.env.STORAGE_DATABASE_PASSWORD,
            database: process.env.STORAGE_DATABASE
        };
        this.connection = await typeorm_1.createConnection(Object.assign(Object.assign({}, storageConfig), { entities: [
                model_1.Avatar,
                model_1.Conversation,
                model_1.Deck,
                model_1.Match,
                model_1.Message,
                model_1.Replay,
                model_1.User
            ], synchronize: true, logging: false }));
    }
    async disconnect() {
        if (this.connection === null) {
            return;
        }
        return this.connection.close();
    }
    get manager() {
        if (this.connection === null) {
            throw new Error('Not connected to the database.');
        }
        return this.connection.manager;
    }
}
exports.Storage = Storage;
