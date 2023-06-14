"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionNotFoundError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when consumer tries to get connection that does not exist.
 */
var ConnectionNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(ConnectionNotFoundError, _super);
    function ConnectionNotFoundError(name) {
        return _super.call(this, "Connection \"" + name + "\" was not found.") || this;
    }
    return ConnectionNotFoundError;
}(TypeORMError_1.TypeORMError));
exports.ConnectionNotFoundError = ConnectionNotFoundError;

//# sourceMappingURL=ConnectionNotFoundError.js.map
