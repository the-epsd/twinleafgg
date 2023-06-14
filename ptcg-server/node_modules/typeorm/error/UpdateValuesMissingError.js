"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateValuesMissingError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var UpdateValuesMissingError = /** @class */ (function (_super) {
    tslib_1.__extends(UpdateValuesMissingError, _super);
    function UpdateValuesMissingError() {
        return _super.call(this, "Cannot perform update query because update values are not defined. Call \"qb.set(...)\" method to specify updated values.") || this;
    }
    return UpdateValuesMissingError;
}(TypeORMError_1.TypeORMError));
exports.UpdateValuesMissingError = UpdateValuesMissingError;

//# sourceMappingURL=UpdateValuesMissingError.js.map
