import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when consumer tries to access entity manager before connection is established.
 */
var CannotGetEntityManagerNotConnectedError = /** @class */ (function (_super) {
    __extends(CannotGetEntityManagerNotConnectedError, _super);
    function CannotGetEntityManagerNotConnectedError(connectionName) {
        return _super.call(this, "Cannot get entity manager for \"" + connectionName + "\" connection because connection is not yet established.") || this;
    }
    return CannotGetEntityManagerNotConnectedError;
}(TypeORMError));
export { CannotGetEntityManagerNotConnectedError };

//# sourceMappingURL=CannotGetEntityManagerNotConnectedError.js.map
