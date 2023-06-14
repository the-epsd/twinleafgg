"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimisticLockVersionMismatchError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when a version check on an object that uses optimistic locking through a version field fails.
 */
var OptimisticLockVersionMismatchError = /** @class */ (function (_super) {
    tslib_1.__extends(OptimisticLockVersionMismatchError, _super);
    function OptimisticLockVersionMismatchError(entity, expectedVersion, actualVersion) {
        return _super.call(this, "The optimistic lock on entity " + entity + " failed, version " + expectedVersion + " was expected, but is actually " + actualVersion + ".") || this;
    }
    return OptimisticLockVersionMismatchError;
}(TypeORMError_1.TypeORMError));
exports.OptimisticLockVersionMismatchError = OptimisticLockVersionMismatchError;

//# sourceMappingURL=OptimisticLockVersionMismatchError.js.map
