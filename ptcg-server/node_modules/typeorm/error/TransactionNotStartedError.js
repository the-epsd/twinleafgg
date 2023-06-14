"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionNotStartedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when transaction is not started yet and user tries to run commit or rollback.
 */
var TransactionNotStartedError = /** @class */ (function (_super) {
    tslib_1.__extends(TransactionNotStartedError, _super);
    function TransactionNotStartedError() {
        return _super.call(this, "Transaction is not started yet, start transaction before committing or rolling it back.") || this;
    }
    return TransactionNotStartedError;
}(TypeORMError_1.TypeORMError));
exports.TransactionNotStartedError = TransactionNotStartedError;

//# sourceMappingURL=TransactionNotStartedError.js.map
