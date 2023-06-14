import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when selected sql driver does not supports locking.
 */
var LockNotSupportedOnGivenDriverError = /** @class */ (function (_super) {
    __extends(LockNotSupportedOnGivenDriverError, _super);
    function LockNotSupportedOnGivenDriverError() {
        return _super.call(this, "Locking not supported on given driver.") || this;
    }
    return LockNotSupportedOnGivenDriverError;
}(TypeORMError));
export { LockNotSupportedOnGivenDriverError };

//# sourceMappingURL=LockNotSupportedOnGivenDriverError.js.map
