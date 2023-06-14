"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotAttachTreeChildrenEntityError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when user saves tree children entity but its parent is not saved yet.
*/
var CannotAttachTreeChildrenEntityError = /** @class */ (function (_super) {
    tslib_1.__extends(CannotAttachTreeChildrenEntityError, _super);
    function CannotAttachTreeChildrenEntityError(entityName) {
        return _super.call(this, "Cannot attach entity \"" + entityName + "\" to its parent. Please make sure parent " +
            "is saved in the database before saving children nodes.") || this;
    }
    return CannotAttachTreeChildrenEntityError;
}(TypeORMError_1.TypeORMError));
exports.CannotAttachTreeChildrenEntityError = CannotAttachTreeChildrenEntityError;

//# sourceMappingURL=CannotAttachTreeChildrenEntityError.js.map
