"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistedEntityNotFoundError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown . Theoretically can't be thrown.
 */
var PersistedEntityNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(PersistedEntityNotFoundError, _super);
    function PersistedEntityNotFoundError() {
        return _super.call(this, "Internal error. Persisted entity was not found in the list of prepared operated entities.") || this;
    }
    return PersistedEntityNotFoundError;
}(TypeORMError_1.TypeORMError));
exports.PersistedEntityNotFoundError = PersistedEntityNotFoundError;

//# sourceMappingURL=PersistedEntityNotFoundError.js.map
