import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when consumer tries to recreate connection with the same name, but previous connection was not closed yet.
 */
var AlreadyHasActiveConnectionError = /** @class */ (function (_super) {
    __extends(AlreadyHasActiveConnectionError, _super);
    function AlreadyHasActiveConnectionError(connectionName) {
        return _super.call(this, "Cannot create a new connection named \"" + connectionName + "\", because connection with such name " +
            "already exist and it now has an active connection session.") || this;
    }
    return AlreadyHasActiveConnectionError;
}(TypeORMError));
export { AlreadyHasActiveConnectionError };

//# sourceMappingURL=AlreadyHasActiveConnectionError.js.map
