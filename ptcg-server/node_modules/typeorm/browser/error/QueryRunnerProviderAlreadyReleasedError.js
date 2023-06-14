import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when consumer tries to use query runner from query runner provider after it was released.
 */
var QueryRunnerProviderAlreadyReleasedError = /** @class */ (function (_super) {
    __extends(QueryRunnerProviderAlreadyReleasedError, _super);
    function QueryRunnerProviderAlreadyReleasedError() {
        return _super.call(this, "Database connection provided by a query runner was already " +
            "released, cannot continue to use its querying methods anymore.") || this;
    }
    return QueryRunnerProviderAlreadyReleasedError;
}(TypeORMError));
export { QueryRunnerProviderAlreadyReleasedError };

//# sourceMappingURL=QueryRunnerProviderAlreadyReleasedError.js.map
