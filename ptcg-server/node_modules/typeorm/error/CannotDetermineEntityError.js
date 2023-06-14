"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotDetermineEntityError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when user tries to save/remove/etc. constructor-less object (object literal) instead of entity.
 */
var CannotDetermineEntityError = /** @class */ (function (_super) {
    tslib_1.__extends(CannotDetermineEntityError, _super);
    function CannotDetermineEntityError(operation) {
        return _super.call(this, "Cannot " + operation + ", given value must be instance of entity class, " +
            "instead object literal is given. Or you must specify an entity target to method call.") || this;
    }
    return CannotDetermineEntityError;
}(TypeORMError_1.TypeORMError));
exports.CannotDetermineEntityError = CannotDetermineEntityError;

//# sourceMappingURL=CannotDetermineEntityError.js.map
