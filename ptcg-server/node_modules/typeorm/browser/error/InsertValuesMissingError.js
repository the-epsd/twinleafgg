import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when user tries to insert using QueryBuilder but do not specify what to insert.
 */
var InsertValuesMissingError = /** @class */ (function (_super) {
    __extends(InsertValuesMissingError, _super);
    function InsertValuesMissingError() {
        return _super.call(this, "Cannot perform insert query because values are not defined. " +
            "Call \"qb.values(...)\" method to specify inserted values.") || this;
    }
    return InsertValuesMissingError;
}(TypeORMError));
export { InsertValuesMissingError };

//# sourceMappingURL=InsertValuesMissingError.js.map
