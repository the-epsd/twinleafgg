import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when user saves tree children entity but its parent is not saved yet.
*/
var CannotAttachTreeChildrenEntityError = /** @class */ (function (_super) {
    __extends(CannotAttachTreeChildrenEntityError, _super);
    function CannotAttachTreeChildrenEntityError(entityName) {
        return _super.call(this, "Cannot attach entity \"" + entityName + "\" to its parent. Please make sure parent " +
            "is saved in the database before saving children nodes.") || this;
    }
    return CannotAttachTreeChildrenEntityError;
}(TypeORMError));
export { CannotAttachTreeChildrenEntityError };

//# sourceMappingURL=CannotAttachTreeChildrenEntityError.js.map
