"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimaryColumnCannotBeNullableError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var PrimaryColumnCannotBeNullableError = /** @class */ (function (_super) {
    tslib_1.__extends(PrimaryColumnCannotBeNullableError, _super);
    function PrimaryColumnCannotBeNullableError(object, propertyName) {
        return _super.call(this, "Primary column " + object.constructor.name + "#" + propertyName + " cannot be nullable. " +
            "Its not allowed for primary keys. Try to remove nullable option.") || this;
    }
    return PrimaryColumnCannotBeNullableError;
}(TypeORMError_1.TypeORMError));
exports.PrimaryColumnCannotBeNullableError = PrimaryColumnCannotBeNullableError;

//# sourceMappingURL=PrimaryColumnCannotBeNullableError.js.map
