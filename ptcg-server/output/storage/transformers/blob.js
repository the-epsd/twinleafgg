"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blob = void 0;
exports.blob = {
    to: (entityValue) => entityValue,
    from: (databaseValue) => Buffer.from(databaseValue).toString()
};
