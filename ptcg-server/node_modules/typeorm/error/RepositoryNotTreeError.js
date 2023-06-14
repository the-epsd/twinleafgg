"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryNotTreeError = void 0;
var tslib_1 = require("tslib");
var EntitySchema_1 = require("../entity-schema/EntitySchema");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when repository for the given class is not found.
 */
var RepositoryNotTreeError = /** @class */ (function (_super) {
    tslib_1.__extends(RepositoryNotTreeError, _super);
    function RepositoryNotTreeError(entityClass) {
        var _this = _super.call(this) || this;
        var targetName;
        if (entityClass instanceof EntitySchema_1.EntitySchema) {
            targetName = entityClass.options.name;
        }
        else if (typeof entityClass === "function") {
            targetName = entityClass.name;
        }
        else if (typeof entityClass === "object" && "name" in entityClass) {
            targetName = entityClass.name;
        }
        else {
            targetName = entityClass;
        }
        _this.message = "Repository of the \"" + targetName + "\" class is not a TreeRepository. Try to apply @Tree decorator on your entity.";
        return _this;
    }
    return RepositoryNotTreeError;
}(TypeORMError_1.TypeORMError));
exports.RepositoryNotTreeError = RepositoryNotTreeError;

//# sourceMappingURL=RepositoryNotTreeError.js.map
