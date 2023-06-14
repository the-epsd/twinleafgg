"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverOptionNotSetError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown if some required driver's option is not set.
 */
var DriverOptionNotSetError = /** @class */ (function (_super) {
    tslib_1.__extends(DriverOptionNotSetError, _super);
    function DriverOptionNotSetError(optionName) {
        return _super.call(this, "Driver option (" + optionName + ") is not set. " +
            "Please set it to perform connection to the database.") || this;
    }
    return DriverOptionNotSetError;
}(TypeORMError_1.TypeORMError));
exports.DriverOptionNotSetError = DriverOptionNotSetError;

//# sourceMappingURL=DriverOptionNotSetError.js.map
