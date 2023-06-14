"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockNotSupportedOnGivenDriverError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when selected sql driver does not supports locking.
 */
var LockNotSupportedOnGivenDriverError = /** @class */ (function (_super) {
    tslib_1.__extends(LockNotSupportedOnGivenDriverError, _super);
    function LockNotSupportedOnGivenDriverError() {
        return _super.call(this, "Locking not supported on given driver.") || this;
    }
    return LockNotSupportedOnGivenDriverError;
}(TypeORMError_1.TypeORMError));
exports.LockNotSupportedOnGivenDriverError = LockNotSupportedOnGivenDriverError;

//# sourceMappingURL=LockNotSupportedOnGivenDriverError.js.map
