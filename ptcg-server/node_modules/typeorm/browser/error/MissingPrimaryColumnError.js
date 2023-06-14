import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var MissingPrimaryColumnError = /** @class */ (function (_super) {
    __extends(MissingPrimaryColumnError, _super);
    function MissingPrimaryColumnError(entityMetadata) {
        return _super.call(this, "Entity \"" + entityMetadata.name + "\" does not have a primary column. Primary column is required to " +
            "have in all your entities. Use @PrimaryColumn decorator to add a primary column to your entity.") || this;
    }
    return MissingPrimaryColumnError;
}(TypeORMError));
export { MissingPrimaryColumnError };

//# sourceMappingURL=MissingPrimaryColumnError.js.map
