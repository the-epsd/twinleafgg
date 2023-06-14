import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when an optimistic lock cannot be used in query builder.
 */
var OptimisticLockCanNotBeUsedError = /** @class */ (function (_super) {
    __extends(OptimisticLockCanNotBeUsedError, _super);
    function OptimisticLockCanNotBeUsedError() {
        return _super.call(this, "The optimistic lock can be used only with getOne() method.") || this;
    }
    return OptimisticLockCanNotBeUsedError;
}(TypeORMError));
export { OptimisticLockCanNotBeUsedError };

//# sourceMappingURL=OptimisticLockCanNotBeUsedError.js.map
