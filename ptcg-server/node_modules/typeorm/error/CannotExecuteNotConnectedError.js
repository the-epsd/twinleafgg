"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotExecuteNotConnectedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when consumer tries to execute operation allowed only if connection is opened.
 */
var CannotExecuteNotConnectedError = /** @class */ (function (_super) {
    tslib_1.__extends(CannotExecuteNotConnectedError, _super);
    function CannotExecuteNotConnectedError(connectionName) {
        return _super.call(this, "Cannot execute operation on \"" + connectionName + "\" connection because connection is not yet established.") || this;
    }
    return CannotExecuteNotConnectedError;
}(TypeORMError_1.TypeORMError));
exports.CannotExecuteNotConnectedError = CannotExecuteNotConnectedError;

//# sourceMappingURL=CannotExecuteNotConnectedError.js.map
