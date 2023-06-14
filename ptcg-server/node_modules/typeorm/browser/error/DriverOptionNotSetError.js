import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown if some required driver's option is not set.
 */
var DriverOptionNotSetError = /** @class */ (function (_super) {
    __extends(DriverOptionNotSetError, _super);
    function DriverOptionNotSetError(optionName) {
        return _super.call(this, "Driver option (" + optionName + ") is not set. " +
            "Please set it to perform connection to the database.") || this;
    }
    return DriverOptionNotSetError;
}(TypeORMError));
export { DriverOptionNotSetError };

//# sourceMappingURL=DriverOptionNotSetError.js.map
