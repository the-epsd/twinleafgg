"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionManager = void 0;
var globals_1 = require("../../globals");
/**
 * Injects transaction's entity manager into the method wrapped with @Transaction decorator.
 */
function TransactionManager() {
    return function (object, methodName, index) {
        globals_1.getMetadataArgsStorage().transactionEntityManagers.push({
            target: object.constructor,
            methodName: methodName,
            index: index,
        });
    };
}
exports.TransactionManager = TransactionManager;

//# sourceMappingURL=TransactionManager.js.map
