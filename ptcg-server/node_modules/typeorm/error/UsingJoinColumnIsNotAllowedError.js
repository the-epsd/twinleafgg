"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsingJoinColumnIsNotAllowedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var UsingJoinColumnIsNotAllowedError = /** @class */ (function (_super) {
    tslib_1.__extends(UsingJoinColumnIsNotAllowedError, _super);
    function UsingJoinColumnIsNotAllowedError(entityMetadata, relation) {
        return _super.call(this, "Using JoinColumn on " + entityMetadata.name + "#" + relation.propertyName + " is wrong. " +
            "You can use JoinColumn only on one-to-one and many-to-one relations.") || this;
    }
    return UsingJoinColumnIsNotAllowedError;
}(TypeORMError_1.TypeORMError));
exports.UsingJoinColumnIsNotAllowedError = UsingJoinColumnIsNotAllowedError;

//# sourceMappingURL=UsingJoinColumnIsNotAllowedError.js.map
