import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown if custom repositories that extend AbstractRepository classes does not have managed entity.
 */
var CustomRepositoryDoesNotHaveEntityError = /** @class */ (function (_super) {
    __extends(CustomRepositoryDoesNotHaveEntityError, _super);
    function CustomRepositoryDoesNotHaveEntityError(repository) {
        return _super.call(this, "Custom repository " + (repository instanceof Function ? repository.name : repository.constructor.name) + " does not have managed entity. " +
            "Did you forget to specify entity for it @EntityRepository(MyEntity)? ") || this;
    }
    return CustomRepositoryDoesNotHaveEntityError;
}(TypeORMError));
export { CustomRepositoryDoesNotHaveEntityError };

//# sourceMappingURL=CustomRepositoryDoesNotHaveEntityError.js.map
