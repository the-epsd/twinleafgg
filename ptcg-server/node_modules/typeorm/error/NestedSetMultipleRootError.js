"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedSetMultipleRootError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var NestedSetMultipleRootError = /** @class */ (function (_super) {
    tslib_1.__extends(NestedSetMultipleRootError, _super);
    function NestedSetMultipleRootError() {
        return _super.call(this, "Nested sets do not support multiple root entities.") || this;
    }
    return NestedSetMultipleRootError;
}(TypeORMError_1.TypeORMError));
exports.NestedSetMultipleRootError = NestedSetMultipleRootError;

//# sourceMappingURL=NestedSetMultipleRootError.js.map
