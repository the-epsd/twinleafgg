import { __extends } from "tslib";
import { EntitySchema } from "../entity-schema/EntitySchema";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when repository for the given class is not found.
 */
var RepositoryNotTreeError = /** @class */ (function (_super) {
    __extends(RepositoryNotTreeError, _super);
    function RepositoryNotTreeError(entityClass) {
        var _this = _super.call(this) || this;
        var targetName;
        if (entityClass instanceof EntitySchema) {
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
}(TypeORMError));
export { RepositoryNotTreeError };

//# sourceMappingURL=RepositoryNotTreeError.js.map
