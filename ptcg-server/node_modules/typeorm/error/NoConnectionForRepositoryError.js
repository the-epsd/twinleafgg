"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoConnectionForRepositoryError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when consumer tries to access repository before connection is established.
 */
var NoConnectionForRepositoryError = /** @class */ (function (_super) {
    tslib_1.__extends(NoConnectionForRepositoryError, _super);
    function NoConnectionForRepositoryError(connectionName) {
        return _super.call(this, "Cannot get a Repository for \"" + connectionName + " connection, because connection with the database " +
            "is not established yet. Call connection#connect method to establish connection.") || this;
    }
    return NoConnectionForRepositoryError;
}(TypeORMError_1.TypeORMError));
exports.NoConnectionForRepositoryError = NoConnectionForRepositoryError;

//# sourceMappingURL=NoConnectionForRepositoryError.js.map
