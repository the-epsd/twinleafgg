import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when method expects entity but instead something else is given.
 */
var MustBeEntityError = /** @class */ (function (_super) {
    __extends(MustBeEntityError, _super);
    function MustBeEntityError(operation, wrongValue) {
        return _super.call(this, "Cannot " + operation + ", given value must be an entity, instead \"" + wrongValue + "\" is given.") || this;
    }
    return MustBeEntityError;
}(TypeORMError));
export { MustBeEntityError };

//# sourceMappingURL=MustBeEntityError.js.map
