import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var UsingJoinColumnIsNotAllowedError = /** @class */ (function (_super) {
    __extends(UsingJoinColumnIsNotAllowedError, _super);
    function UsingJoinColumnIsNotAllowedError(entityMetadata, relation) {
        return _super.call(this, "Using JoinColumn on " + entityMetadata.name + "#" + relation.propertyName + " is wrong. " +
            "You can use JoinColumn only on one-to-one and many-to-one relations.") || this;
    }
    return UsingJoinColumnIsNotAllowedError;
}(TypeORMError));
export { UsingJoinColumnIsNotAllowedError };

//# sourceMappingURL=UsingJoinColumnIsNotAllowedError.js.map
