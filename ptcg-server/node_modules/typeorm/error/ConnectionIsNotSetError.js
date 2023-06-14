"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionIsNotSetError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when user tries to execute operation that requires connection to be established.
 */
var ConnectionIsNotSetError = /** @class */ (function (_super) {
    tslib_1.__extends(ConnectionIsNotSetError, _super);
    function ConnectionIsNotSetError(dbType) {
        return _super.call(this, "Connection with " + dbType + " database is not established. Check connection configuration.") || this;
    }
    return ConnectionIsNotSetError;
}(TypeORMError_1.TypeORMError));
exports.ConnectionIsNotSetError = ConnectionIsNotSetError;

//# sourceMappingURL=ConnectionIsNotSetError.js.map
