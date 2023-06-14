import { __extends } from "tslib";
import { EntitySchema } from "../entity-schema/EntitySchema";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when no result could be found in methods which are not allowed to return undefined or an empty set.
 */
var EntityNotFoundError = /** @class */ (function (_super) {
    __extends(EntityNotFoundError, _super);
    function EntityNotFoundError(entityClass, criteria) {
        var _this = _super.call(this) || this;
        _this.message = "Could not find any entity of type \"" + _this.stringifyTarget(entityClass) + "\" " +
            ("matching: " + _this.stringifyCriteria(criteria));
        return _this;
    }
    EntityNotFoundError.prototype.stringifyTarget = function (target) {
        if (target instanceof EntitySchema) {
            return target.options.name;
        }
        else if (typeof target === "function") {
            return target.name;
        }
        else if (typeof target === "object" && "name" in target) {
            return target.name;
        }
        else {
            return target;
        }
    };
    EntityNotFoundError.prototype.stringifyCriteria = function (criteria) {
        try {
            return JSON.stringify(criteria, null, 4);
        }
        catch (e) { }
        return "" + criteria;
    };
    return EntityNotFoundError;
}(TypeORMError));
export { EntityNotFoundError };

//# sourceMappingURL=EntityNotFoundError.js.map
