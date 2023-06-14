"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryRunnerProviderAlreadyReleasedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when consumer tries to use query runner from query runner provider after it was released.
 */
var QueryRunnerProviderAlreadyReleasedError = /** @class */ (function (_super) {
    tslib_1.__extends(QueryRunnerProviderAlreadyReleasedError, _super);
    function QueryRunnerProviderAlreadyReleasedError() {
        return _super.call(this, "Database connection provided by a query runner was already " +
            "released, cannot continue to use its querying methods anymore.") || this;
    }
    return QueryRunnerProviderAlreadyReleasedError;
}(TypeORMError_1.TypeORMError));
exports.QueryRunnerProviderAlreadyReleasedError = QueryRunnerProviderAlreadyReleasedError;

//# sourceMappingURL=QueryRunnerProviderAlreadyReleasedError.js.map
