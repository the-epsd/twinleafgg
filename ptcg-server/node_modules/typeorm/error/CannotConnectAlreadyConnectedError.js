"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotConnectAlreadyConnectedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when consumer tries to connect when he already connected.
 */
var CannotConnectAlreadyConnectedError = /** @class */ (function (_super) {
    tslib_1.__extends(CannotConnectAlreadyConnectedError, _super);
    function CannotConnectAlreadyConnectedError(connectionName) {
        return _super.call(this, "Cannot create a \"" + connectionName + "\" connection because connection to the database already established.") || this;
    }
    return CannotConnectAlreadyConnectedError;
}(TypeORMError_1.TypeORMError));
exports.CannotConnectAlreadyConnectedError = CannotConnectAlreadyConnectedError;

//# sourceMappingURL=CannotConnectAlreadyConnectedError.js.map
