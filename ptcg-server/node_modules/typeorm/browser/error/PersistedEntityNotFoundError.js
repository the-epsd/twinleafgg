import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown . Theoretically can't be thrown.
 */
var PersistedEntityNotFoundError = /** @class */ (function (_super) {
    __extends(PersistedEntityNotFoundError, _super);
    function PersistedEntityNotFoundError() {
        return _super.call(this, "Internal error. Persisted entity was not found in the list of prepared operated entities.") || this;
    }
    return PersistedEntityNotFoundError;
}(TypeORMError));
export { PersistedEntityNotFoundError };

//# sourceMappingURL=PersistedEntityNotFoundError.js.map
