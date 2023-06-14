"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustBeEntityError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when method expects entity but instead something else is given.
 */
var MustBeEntityError = /** @class */ (function (_super) {
    tslib_1.__extends(MustBeEntityError, _super);
    function MustBeEntityError(operation, wrongValue) {
        return _super.call(this, "Cannot " + operation + ", given value must be an entity, instead \"" + wrongValue + "\" is given.") || this;
    }
    return MustBeEntityError;
}(TypeORMError_1.TypeORMError));
exports.MustBeEntityError = MustBeEntityError;

//# sourceMappingURL=MustBeEntityError.js.map
