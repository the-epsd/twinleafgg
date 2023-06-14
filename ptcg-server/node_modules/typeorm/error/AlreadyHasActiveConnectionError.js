"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlreadyHasActiveConnectionError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when consumer tries to recreate connection with the same name, but previous connection was not closed yet.
 */
var AlreadyHasActiveConnectionError = /** @class */ (function (_super) {
    tslib_1.__extends(AlreadyHasActiveConnectionError, _super);
    function AlreadyHasActiveConnectionError(connectionName) {
        return _super.call(this, "Cannot create a new connection named \"" + connectionName + "\", because connection with such name " +
            "already exist and it now has an active connection session.") || this;
    }
    return AlreadyHasActiveConnectionError;
}(TypeORMError_1.TypeORMError));
exports.AlreadyHasActiveConnectionError = AlreadyHasActiveConnectionError;

//# sourceMappingURL=AlreadyHasActiveConnectionError.js.map
