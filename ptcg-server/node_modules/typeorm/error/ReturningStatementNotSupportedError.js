"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturningStatementNotSupportedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when user tries to build a query with RETURNING / OUTPUT statement,
 * but used database does not support it.
 */
var ReturningStatementNotSupportedError = /** @class */ (function (_super) {
    tslib_1.__extends(ReturningStatementNotSupportedError, _super);
    function ReturningStatementNotSupportedError() {
        return _super.call(this, "OUTPUT or RETURNING clause only supported by Microsoft SQL Server or PostgreSQL databases.") || this;
    }
    return ReturningStatementNotSupportedError;
}(TypeORMError_1.TypeORMError));
exports.ReturningStatementNotSupportedError = ReturningStatementNotSupportedError;

//# sourceMappingURL=ReturningStatementNotSupportedError.js.map
