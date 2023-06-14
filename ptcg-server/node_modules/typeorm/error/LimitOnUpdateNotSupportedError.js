"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitOnUpdateNotSupportedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when user tries to build an UPDATE query with LIMIT but the database does not support it.
*/
var LimitOnUpdateNotSupportedError = /** @class */ (function (_super) {
    tslib_1.__extends(LimitOnUpdateNotSupportedError, _super);
    function LimitOnUpdateNotSupportedError() {
        return _super.call(this, "Your database does not support LIMIT on UPDATE statements.") || this;
    }
    return LimitOnUpdateNotSupportedError;
}(TypeORMError_1.TypeORMError));
exports.LimitOnUpdateNotSupportedError = LimitOnUpdateNotSupportedError;

//# sourceMappingURL=LimitOnUpdateNotSupportedError.js.map
