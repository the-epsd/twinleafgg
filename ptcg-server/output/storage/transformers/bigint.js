"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigint = void 0;
exports.bigint = {
    to: (entityValue) => entityValue,
    from: (databaseValue) => parseInt(databaseValue, 10)
};
