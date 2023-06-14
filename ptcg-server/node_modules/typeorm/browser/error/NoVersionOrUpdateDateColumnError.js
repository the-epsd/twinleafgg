import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when an entity does not have no version and no update date column.
 */
var NoVersionOrUpdateDateColumnError = /** @class */ (function (_super) {
    __extends(NoVersionOrUpdateDateColumnError, _super);
    function NoVersionOrUpdateDateColumnError(entity) {
        return _super.call(this, "Entity " + entity + " does not have version or update date columns.") || this;
    }
    return NoVersionOrUpdateDateColumnError;
}(TypeORMError));
export { NoVersionOrUpdateDateColumnError };

//# sourceMappingURL=NoVersionOrUpdateDateColumnError.js.map
