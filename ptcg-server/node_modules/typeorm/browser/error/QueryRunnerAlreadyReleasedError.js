import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var QueryRunnerAlreadyReleasedError = /** @class */ (function (_super) {
    __extends(QueryRunnerAlreadyReleasedError, _super);
    function QueryRunnerAlreadyReleasedError() {
        return _super.call(this, "Query runner already released. Cannot run queries anymore.") || this;
    }
    return QueryRunnerAlreadyReleasedError;
}(TypeORMError));
export { QueryRunnerAlreadyReleasedError };

//# sourceMappingURL=QueryRunnerAlreadyReleasedError.js.map
