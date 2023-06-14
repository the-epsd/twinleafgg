"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffsetWithoutLimitNotSupportedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when user tries to build SELECT query using OFFSET without LIMIT applied but database does not support it.
*/
var OffsetWithoutLimitNotSupportedError = /** @class */ (function (_super) {
    tslib_1.__extends(OffsetWithoutLimitNotSupportedError, _super);
    function OffsetWithoutLimitNotSupportedError() {
        return _super.call(this, "RDBMS does not support OFFSET without LIMIT in SELECT statements. You must use limit in " +
            "conjunction with offset function (or take in conjunction with skip function if you are " +
            "using pagination).") || this;
    }
    return OffsetWithoutLimitNotSupportedError;
}(TypeORMError_1.TypeORMError));
exports.OffsetWithoutLimitNotSupportedError = OffsetWithoutLimitNotSupportedError;

//# sourceMappingURL=OffsetWithoutLimitNotSupportedError.js.map
