import { __extends } from "tslib";
import { EntitySchema } from "../entity-schema/EntitySchema";
import { TypeORMError } from "./TypeORMError";
var EntityMetadataNotFoundError = /** @class */ (function (_super) {
    __extends(EntityMetadataNotFoundError, _super);
    function EntityMetadataNotFoundError(target) {
        var _this = _super.call(this) || this;
        _this.message = "No metadata for \"" + _this.stringifyTarget(target) + "\" was found.";
        return _this;
    }
    EntityMetadataNotFoundError.prototype.stringifyTarget = function (target) {
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
    return EntityMetadataNotFoundError;
}(TypeORMError));
export { EntityMetadataNotFoundError };

//# sourceMappingURL=EntityMetadataNotFoundError.js.map
