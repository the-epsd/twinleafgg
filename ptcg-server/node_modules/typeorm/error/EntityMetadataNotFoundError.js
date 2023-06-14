"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityMetadataNotFoundError = void 0;
var tslib_1 = require("tslib");
var EntitySchema_1 = require("../entity-schema/EntitySchema");
var TypeORMError_1 = require("./TypeORMError");
var EntityMetadataNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(EntityMetadataNotFoundError, _super);
    function EntityMetadataNotFoundError(target) {
        var _this = _super.call(this) || this;
        _this.message = "No metadata for \"" + _this.stringifyTarget(target) + "\" was found.";
        return _this;
    }
    EntityMetadataNotFoundError.prototype.stringifyTarget = function (target) {
        if (target instanceof EntitySchema_1.EntitySchema) {
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
}(TypeORMError_1.TypeORMError));
exports.EntityMetadataNotFoundError = EntityMetadataNotFoundError;

//# sourceMappingURL=EntityMetadataNotFoundError.js.map
