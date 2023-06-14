import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when consumer specifies driver type that does not exist or supported.
 */
var MissingDriverError = /** @class */ (function (_super) {
    __extends(MissingDriverError, _super);
    function MissingDriverError(driverType, availableDrivers) {
        if (availableDrivers === void 0) { availableDrivers = []; }
        return _super.call(this, "Wrong driver: \"" + driverType + "\" given. Supported drivers are: " +
            (availableDrivers.map(function (d) { return "\"" + d + "\""; }).join(", ") + ".")) || this;
    }
    return MissingDriverError;
}(TypeORMError));
export { MissingDriverError };

//# sourceMappingURL=MissingDriverError.js.map
