import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown if custom repository inherits Repository class however entity is not set in @EntityRepository decorator.
 */
var CustomRepositoryCannotInheritRepositoryError = /** @class */ (function (_super) {
    __extends(CustomRepositoryCannotInheritRepositoryError, _super);
    function CustomRepositoryCannotInheritRepositoryError(repository) {
        return _super.call(this, "Custom entity repository " + (repository instanceof Function ? repository.name : repository.constructor.name) + " " +
            " cannot inherit Repository class without entity being set in the @EntityRepository decorator.") || this;
    }
    return CustomRepositoryCannotInheritRepositoryError;
}(TypeORMError));
export { CustomRepositoryCannotInheritRepositoryError };

//# sourceMappingURL=CustomRepositoryCannotInheritRepositoryError.js.map
