import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when user tries to execute operation that requires connection to be established.
 */
var ConnectionIsNotSetError = /** @class */ (function (_super) {
    __extends(ConnectionIsNotSetError, _super);
    function ConnectionIsNotSetError(dbType) {
        return _super.call(this, "Connection with " + dbType + " database is not established. Check connection configuration.") || this;
    }
    return ConnectionIsNotSetError;
}(TypeORMError));
export { ConnectionIsNotSetError };

//# sourceMappingURL=ConnectionIsNotSetError.js.map
