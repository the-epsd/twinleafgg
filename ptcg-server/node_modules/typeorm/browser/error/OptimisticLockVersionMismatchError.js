import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when a version check on an object that uses optimistic locking through a version field fails.
 */
var OptimisticLockVersionMismatchError = /** @class */ (function (_super) {
    __extends(OptimisticLockVersionMismatchError, _super);
    function OptimisticLockVersionMismatchError(entity, expectedVersion, actualVersion) {
        return _super.call(this, "The optimistic lock on entity " + entity + " failed, version " + expectedVersion + " was expected, but is actually " + actualVersion + ".") || this;
    }
    return OptimisticLockVersionMismatchError;
}(TypeORMError));
export { OptimisticLockVersionMismatchError };

//# sourceMappingURL=OptimisticLockVersionMismatchError.js.map
