"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRepositoryNotFoundError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown if custom repository was not found.
 */
var CustomRepositoryNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(CustomRepositoryNotFoundError, _super);
    function CustomRepositoryNotFoundError(repository) {
        return _super.call(this, "Custom repository " + (repository instanceof Function ? repository.name : repository.constructor.name) + " was not found. " +
            "Did you forgot to put @EntityRepository decorator on it?") || this;
    }
    return CustomRepositoryNotFoundError;
}(TypeORMError_1.TypeORMError));
exports.CustomRepositoryNotFoundError = CustomRepositoryNotFoundError;

//# sourceMappingURL=CustomRepositoryNotFoundError.js.map
