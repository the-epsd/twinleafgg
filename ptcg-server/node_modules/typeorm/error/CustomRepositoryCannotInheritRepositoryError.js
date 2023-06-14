"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRepositoryCannotInheritRepositoryError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown if custom repository inherits Repository class however entity is not set in @EntityRepository decorator.
 */
var CustomRepositoryCannotInheritRepositoryError = /** @class */ (function (_super) {
    tslib_1.__extends(CustomRepositoryCannotInheritRepositoryError, _super);
    function CustomRepositoryCannotInheritRepositoryError(repository) {
        return _super.call(this, "Custom entity repository " + (repository instanceof Function ? repository.name : repository.constructor.name) + " " +
            " cannot inherit Repository class without entity being set in the @EntityRepository decorator.") || this;
    }
    return CustomRepositoryCannotInheritRepositoryError;
}(TypeORMError_1.TypeORMError));
exports.CustomRepositoryCannotInheritRepositoryError = CustomRepositoryCannotInheritRepositoryError;

//# sourceMappingURL=CustomRepositoryCannotInheritRepositoryError.js.map
