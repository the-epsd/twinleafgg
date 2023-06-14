"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotGetEntityManagerNotConnectedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when consumer tries to access entity manager before connection is established.
 */
var CannotGetEntityManagerNotConnectedError = /** @class */ (function (_super) {
    tslib_1.__extends(CannotGetEntityManagerNotConnectedError, _super);
    function CannotGetEntityManagerNotConnectedError(connectionName) {
        return _super.call(this, "Cannot get entity manager for \"" + connectionName + "\" connection because connection is not yet established.") || this;
    }
    return CannotGetEntityManagerNotConnectedError;
}(TypeORMError_1.TypeORMError));
exports.CannotGetEntityManagerNotConnectedError = CannotGetEntityManagerNotConnectedError;

//# sourceMappingURL=CannotGetEntityManagerNotConnectedError.js.map
