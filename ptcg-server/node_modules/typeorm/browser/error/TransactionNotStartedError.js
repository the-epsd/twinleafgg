import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when transaction is not started yet and user tries to run commit or rollback.
 */
var TransactionNotStartedError = /** @class */ (function (_super) {
    __extends(TransactionNotStartedError, _super);
    function TransactionNotStartedError() {
        return _super.call(this, "Transaction is not started yet, start transaction before committing or rolling it back.") || this;
    }
    return TransactionNotStartedError;
}(TypeORMError));
export { TransactionNotStartedError };

//# sourceMappingURL=TransactionNotStartedError.js.map
