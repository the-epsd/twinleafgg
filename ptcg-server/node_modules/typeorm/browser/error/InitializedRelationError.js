import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when relation has array initialized which is forbidden my ORM.
 *
 * @see https://github.com/typeorm/typeorm/issues/1319
 * @see http://typeorm.io/#/relations-faq/avoid-relation-property-initializers
 */
var InitializedRelationError = /** @class */ (function (_super) {
    __extends(InitializedRelationError, _super);
    function InitializedRelationError(relation) {
        return _super.call(this, "Array initializations are not allowed in entity relations. " +
            ("Please remove array initialization (= []) from \"" + relation.entityMetadata.targetName + "#" + relation.propertyPath + "\". ") +
            "This is ORM requirement to make relations to work properly. Refer docs for more information.") || this;
    }
    return InitializedRelationError;
}(TypeORMError));
export { InitializedRelationError };

//# sourceMappingURL=InitializedRelationError.js.map
