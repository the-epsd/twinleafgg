"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularRelationsError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when circular relations detected with nullable set to false.
 */
var CircularRelationsError = /** @class */ (function (_super) {
    tslib_1.__extends(CircularRelationsError, _super);
    function CircularRelationsError(path) {
        return _super.call(this, "Circular relations detected: " + path + ". To resolve this issue you need to " +
            "set nullable: true somewhere in this dependency structure.") || this;
    }
    return CircularRelationsError;
}(TypeORMError_1.TypeORMError));
exports.CircularRelationsError = CircularRelationsError;

//# sourceMappingURL=CircularRelationsError.js.map
