import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when a transaction is required for the current operation, but there is none open.
 */
var PessimisticLockTransactionRequiredError = /** @class */ (function (_super) {
    __extends(PessimisticLockTransactionRequiredError, _super);
    function PessimisticLockTransactionRequiredError() {
        return _super.call(this, "An open transaction is required for pessimistic lock.") || this;
    }
    return PessimisticLockTransactionRequiredError;
}(TypeORMError));
export { PessimisticLockTransactionRequiredError };

//# sourceMappingURL=PessimisticLockTransactionRequiredError.js.map
