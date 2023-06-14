import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when consumer tries to release entity manager that does not use single database connection.
 */
var NoNeedToReleaseEntityManagerError = /** @class */ (function (_super) {
    __extends(NoNeedToReleaseEntityManagerError, _super);
    function NoNeedToReleaseEntityManagerError() {
        return _super.call(this, "Entity manager is not using single database connection and cannot be released. " +
            "Only entity managers created by connection#createEntityManagerWithSingleDatabaseConnection " +
            "methods have a single database connection and they should be released.") || this;
    }
    return NoNeedToReleaseEntityManagerError;
}(TypeORMError));
export { NoNeedToReleaseEntityManagerError };

//# sourceMappingURL=NoNeedToReleaseEntityManagerError.js.map
