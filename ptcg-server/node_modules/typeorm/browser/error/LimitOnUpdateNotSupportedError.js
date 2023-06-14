import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when user tries to build an UPDATE query with LIMIT but the database does not support it.
*/
var LimitOnUpdateNotSupportedError = /** @class */ (function (_super) {
    __extends(LimitOnUpdateNotSupportedError, _super);
    function LimitOnUpdateNotSupportedError() {
        return _super.call(this, "Your database does not support LIMIT on UPDATE statements.") || this;
    }
    return LimitOnUpdateNotSupportedError;
}(TypeORMError));
export { LimitOnUpdateNotSupportedError };

//# sourceMappingURL=LimitOnUpdateNotSupportedError.js.map
