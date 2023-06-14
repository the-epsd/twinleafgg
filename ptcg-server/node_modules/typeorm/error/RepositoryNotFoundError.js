"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryNotFoundError = void 0;
var tslib_1 = require("tslib");
var EntitySchema_1 = require("../entity-schema/EntitySchema");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when repository for the given class is not found.
 */
var RepositoryNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(RepositoryNotFoundError, _super);
    function RepositoryNotFoundError(connectionName, entityClass) {
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
        _this.message = "No repository for \"" + targetName + "\" was found. Looks like this entity is not registered in " +
            ("current \"" + connectionName + "\" connection?");
        return _this;
    }
    return RepositoryNotFoundError;
}(TypeORMError_1.TypeORMError));
exports.RepositoryNotFoundError = RepositoryNotFoundError;

//# sourceMappingURL=RepositoryNotFoundError.js.map
