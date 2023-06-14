"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeRepositoryNotSupportedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var TreeRepositoryNotSupportedError = /** @class */ (function (_super) {
    tslib_1.__extends(TreeRepositoryNotSupportedError, _super);
    function TreeRepositoryNotSupportedError(driver) {
        return _super.call(this, "Tree repositories are not supported in " + driver.options.type + " driver.") || this;
    }
    return TreeRepositoryNotSupportedError;
}(TypeORMError_1.TypeORMError));
exports.TreeRepositoryNotSupportedError = TreeRepositoryNotSupportedError;

//# sourceMappingURL=TreeRepositoryNotSupportedError.js.map
