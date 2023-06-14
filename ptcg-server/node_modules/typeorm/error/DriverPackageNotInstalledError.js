"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverPackageNotInstalledError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when required driver's package is not installed.
 */
var DriverPackageNotInstalledError = /** @class */ (function (_super) {
    tslib_1.__extends(DriverPackageNotInstalledError, _super);
    function DriverPackageNotInstalledError(driverName, packageName) {
        return _super.call(this, driverName + " package has not been found installed. " +
            ("Try to install it: npm install " + packageName + " --save")) || this;
    }
    return DriverPackageNotInstalledError;
}(TypeORMError_1.TypeORMError));
exports.DriverPackageNotInstalledError = DriverPackageNotInstalledError;

//# sourceMappingURL=DriverPackageNotInstalledError.js.map
