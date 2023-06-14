"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRepositoryDoesNotHaveEntityError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown if custom repositories that extend AbstractRepository classes does not have managed entity.
 */
var CustomRepositoryDoesNotHaveEntityError = /** @class */ (function (_super) {
    tslib_1.__extends(CustomRepositoryDoesNotHaveEntityError, _super);
    function CustomRepositoryDoesNotHaveEntityError(repository) {
        return _super.call(this, "Custom repository " + (repository instanceof Function ? repository.name : repository.constructor.name) + " does not have managed entity. " +
            "Did you forget to specify entity for it @EntityRepository(MyEntity)? ") || this;
    }
    return CustomRepositoryDoesNotHaveEntityError;
}(TypeORMError_1.TypeORMError));
exports.CustomRepositoryDoesNotHaveEntityError = CustomRepositoryDoesNotHaveEntityError;

//# sourceMappingURL=CustomRepositoryDoesNotHaveEntityError.js.map
