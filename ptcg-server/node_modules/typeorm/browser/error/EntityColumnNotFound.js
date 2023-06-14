import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var EntityColumnNotFound = /** @class */ (function (_super) {
    __extends(EntityColumnNotFound, _super);
    function EntityColumnNotFound(propertyPath) {
        return _super.call(this, "No entity column \"" + propertyPath + "\" was found.") || this;
    }
    return EntityColumnNotFound;
}(TypeORMError));
export { EntityColumnNotFound };

//# sourceMappingURL=EntityColumnNotFound.js.map
