"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertValuesMissingError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when user tries to insert using QueryBuilder but do not specify what to insert.
 */
var InsertValuesMissingError = /** @class */ (function (_super) {
    tslib_1.__extends(InsertValuesMissingError, _super);
    function InsertValuesMissingError() {
        return _super.call(this, "Cannot perform insert query because values are not defined. " +
            "Call \"qb.values(...)\" method to specify inserted values.") || this;
    }
    return InsertValuesMissingError;
}(TypeORMError_1.TypeORMError));
exports.InsertValuesMissingError = InsertValuesMissingError;

//# sourceMappingURL=InsertValuesMissingError.js.map
