import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when user tries to build a query with RETURNING / OUTPUT statement,
 * but used database does not support it.
 */
var ReturningStatementNotSupportedError = /** @class */ (function (_super) {
    __extends(ReturningStatementNotSupportedError, _super);
    function ReturningStatementNotSupportedError() {
        return _super.call(this, "OUTPUT or RETURNING clause only supported by Microsoft SQL Server or PostgreSQL databases.") || this;
    }
    return ReturningStatementNotSupportedError;
}(TypeORMError));
export { ReturningStatementNotSupportedError };

//# sourceMappingURL=ReturningStatementNotSupportedError.js.map
