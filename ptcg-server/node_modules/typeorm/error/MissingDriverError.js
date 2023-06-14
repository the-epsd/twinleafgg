"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingDriverError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when consumer specifies driver type that does not exist or supported.
 */
var MissingDriverError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingDriverError, _super);
    function MissingDriverError(driverType, availableDrivers) {
        if (availableDrivers === void 0) { availableDrivers = []; }
        return _super.call(this, "Wrong driver: \"" + driverType + "\" given. Supported drivers are: " +
            (availableDrivers.map(function (d) { return "\"" + d + "\""; }).join(", ") + ".")) || this;
    }
    return MissingDriverError;
}(TypeORMError_1.TypeORMError));
exports.MissingDriverError = MissingDriverError;

//# sourceMappingURL=MissingDriverError.js.map
