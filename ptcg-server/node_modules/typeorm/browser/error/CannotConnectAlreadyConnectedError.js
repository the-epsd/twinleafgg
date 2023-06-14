import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when consumer tries to connect when he already connected.
 */
var CannotConnectAlreadyConnectedError = /** @class */ (function (_super) {
    __extends(CannotConnectAlreadyConnectedError, _super);
    function CannotConnectAlreadyConnectedError(connectionName) {
        return _super.call(this, "Cannot create a \"" + connectionName + "\" connection because connection to the database already established.") || this;
    }
    return CannotConnectAlreadyConnectedError;
}(TypeORMError));
export { CannotConnectAlreadyConnectedError };

//# sourceMappingURL=CannotConnectAlreadyConnectedError.js.map
