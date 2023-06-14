"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingJoinColumnError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var MissingJoinColumnError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingJoinColumnError, _super);
    function MissingJoinColumnError(entityMetadata, relation) {
        var _this = _super.call(this) || this;
        if (relation.inverseRelation) {
            _this.message = "JoinColumn is missing on both sides of " + entityMetadata.name + "#" + relation.propertyName + " and " +
                (relation.inverseEntityMetadata.name + "#" + relation.inverseRelation.propertyName + " one-to-one relationship. ") +
                "You need to put JoinColumn decorator on one of the sides.";
        }
        else {
            _this.message = "JoinColumn is missing on " + entityMetadata.name + "#" + relation.propertyName + " one-to-one relationship. " +
                "You need to put JoinColumn decorator on it.";
        }
        return _this;
    }
    return MissingJoinColumnError;
}(TypeORMError_1.TypeORMError));
exports.MissingJoinColumnError = MissingJoinColumnError;

//# sourceMappingURL=MissingJoinColumnError.js.map
