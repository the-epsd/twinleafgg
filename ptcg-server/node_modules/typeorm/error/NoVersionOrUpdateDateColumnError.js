"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoVersionOrUpdateDateColumnError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when an entity does not have no version and no update date column.
 */
var NoVersionOrUpdateDateColumnError = /** @class */ (function (_super) {
    tslib_1.__extends(NoVersionOrUpdateDateColumnError, _super);
    function NoVersionOrUpdateDateColumnError(entity) {
        return _super.call(this, "Entity " + entity + " does not have version or update date columns.") || this;
    }
    return NoVersionOrUpdateDateColumnError;
}(TypeORMError_1.TypeORMError));
exports.NoVersionOrUpdateDateColumnError = NoVersionOrUpdateDateColumnError;

//# sourceMappingURL=NoVersionOrUpdateDateColumnError.js.map
