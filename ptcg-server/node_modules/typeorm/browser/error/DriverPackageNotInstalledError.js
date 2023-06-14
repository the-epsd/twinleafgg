import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when required driver's package is not installed.
 */
var DriverPackageNotInstalledError = /** @class */ (function (_super) {
    __extends(DriverPackageNotInstalledError, _super);
    function DriverPackageNotInstalledError(driverName, packageName) {
        return _super.call(this, driverName + " package has not been found installed. " +
            ("Try to install it: npm install " + packageName + " --save")) || this;
    }
    return DriverPackageNotInstalledError;
}(TypeORMError));
export { DriverPackageNotInstalledError };

//# sourceMappingURL=DriverPackageNotInstalledError.js.map
