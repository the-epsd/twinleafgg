import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when transaction is already started and user tries to run it again.
 */
var TransactionAlreadyStartedError = /** @class */ (function (_super) {
    __extends(TransactionAlreadyStartedError, _super);
    function TransactionAlreadyStartedError() {
        return _super.call(this, "Transaction already started for the given connection, commit current transaction before starting a new one.") || this;
    }
    return TransactionAlreadyStartedError;
}(TypeORMError));
export { TransactionAlreadyStartedError };

//# sourceMappingURL=TransactionAlreadyStartedError.js.map
