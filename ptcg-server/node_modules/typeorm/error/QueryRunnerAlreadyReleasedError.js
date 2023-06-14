"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryRunnerAlreadyReleasedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var QueryRunnerAlreadyReleasedError = /** @class */ (function (_super) {
    tslib_1.__extends(QueryRunnerAlreadyReleasedError, _super);
    function QueryRunnerAlreadyReleasedError() {
        return _super.call(this, "Query runner already released. Cannot run queries anymore.") || this;
    }
    return QueryRunnerAlreadyReleasedError;
}(TypeORMError_1.TypeORMError));
exports.QueryRunnerAlreadyReleasedError = QueryRunnerAlreadyReleasedError;

//# sourceMappingURL=QueryRunnerAlreadyReleasedError.js.map
