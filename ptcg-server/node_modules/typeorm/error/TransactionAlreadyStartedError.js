"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionAlreadyStartedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when transaction is already started and user tries to run it again.
 */
var TransactionAlreadyStartedError = /** @class */ (function (_super) {
    tslib_1.__extends(TransactionAlreadyStartedError, _super);
    function TransactionAlreadyStartedError() {
        return _super.call(this, "Transaction already started for the given connection, commit current transaction before starting a new one.") || this;
    }
    return TransactionAlreadyStartedError;
}(TypeORMError_1.TypeORMError));
exports.TransactionAlreadyStartedError = TransactionAlreadyStartedError;

//# sourceMappingURL=TransactionAlreadyStartedError.js.map
