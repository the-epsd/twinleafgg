"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimisticLockCanNotBeUsedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when an optimistic lock cannot be used in query builder.
 */
var OptimisticLockCanNotBeUsedError = /** @class */ (function (_super) {
    tslib_1.__extends(OptimisticLockCanNotBeUsedError, _super);
    function OptimisticLockCanNotBeUsedError() {
        return _super.call(this, "The optimistic lock can be used only with getOne() method.") || this;
    }
    return OptimisticLockCanNotBeUsedError;
}(TypeORMError_1.TypeORMError));
exports.OptimisticLockCanNotBeUsedError = OptimisticLockCanNotBeUsedError;

//# sourceMappingURL=OptimisticLockCanNotBeUsedError.js.map
