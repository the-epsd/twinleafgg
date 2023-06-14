"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PessimisticLockTransactionRequiredError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when a transaction is required for the current operation, but there is none open.
 */
var PessimisticLockTransactionRequiredError = /** @class */ (function (_super) {
    tslib_1.__extends(PessimisticLockTransactionRequiredError, _super);
    function PessimisticLockTransactionRequiredError() {
        return _super.call(this, "An open transaction is required for pessimistic lock.") || this;
    }
    return PessimisticLockTransactionRequiredError;
}(TypeORMError_1.TypeORMError));
exports.PessimisticLockTransactionRequiredError = PessimisticLockTransactionRequiredError;

//# sourceMappingURL=PessimisticLockTransactionRequiredError.js.map
