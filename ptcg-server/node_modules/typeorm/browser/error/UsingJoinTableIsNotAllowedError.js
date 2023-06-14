import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var UsingJoinTableIsNotAllowedError = /** @class */ (function (_super) {
    __extends(UsingJoinTableIsNotAllowedError, _super);
    function UsingJoinTableIsNotAllowedError(entityMetadata, relation) {
        return _super.call(this, "Using JoinTable on " + entityMetadata.name + "#" + relation.propertyName + " is wrong. " +
            (entityMetadata.name + "#" + relation.propertyName + " has " + relation.relationType + " relation, ") +
            "however you can use JoinTable only on many-to-many relations.") || this;
    }
    return UsingJoinTableIsNotAllowedError;
}(TypeORMError));
export { UsingJoinTableIsNotAllowedError };

//# sourceMappingURL=UsingJoinTableIsNotAllowedError.js.map
