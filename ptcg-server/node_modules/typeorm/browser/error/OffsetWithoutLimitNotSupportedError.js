import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when user tries to build SELECT query using OFFSET without LIMIT applied but database does not support it.
*/
var OffsetWithoutLimitNotSupportedError = /** @class */ (function (_super) {
    __extends(OffsetWithoutLimitNotSupportedError, _super);
    function OffsetWithoutLimitNotSupportedError() {
        return _super.call(this, "RDBMS does not support OFFSET without LIMIT in SELECT statements. You must use limit in " +
            "conjunction with offset function (or take in conjunction with skip function if you are " +
            "using pagination).") || this;
    }
    return OffsetWithoutLimitNotSupportedError;
}(TypeORMError));
export { OffsetWithoutLimitNotSupportedError };

//# sourceMappingURL=OffsetWithoutLimitNotSupportedError.js.map
