"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsingJoinTableOnlyOnOneSideAllowedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var UsingJoinTableOnlyOnOneSideAllowedError = /** @class */ (function (_super) {
    tslib_1.__extends(UsingJoinTableOnlyOnOneSideAllowedError, _super);
    function UsingJoinTableOnlyOnOneSideAllowedError(entityMetadata, relation) {
        return _super.call(this, "Using JoinTable is allowed only on one side of the many-to-many relationship. " +
            ("Both " + entityMetadata.name + "#" + relation.propertyName + " and " + relation.inverseEntityMetadata.name + "#" + relation.inverseRelation.propertyName + " ") +
            "has JoinTable decorators. Choose one of them and left JoinColumn decorator only on it.") || this;
    }
    return UsingJoinTableOnlyOnOneSideAllowedError;
}(TypeORMError_1.TypeORMError));
exports.UsingJoinTableOnlyOnOneSideAllowedError = UsingJoinTableOnlyOnOneSideAllowedError;

//# sourceMappingURL=UsingJoinTableOnlyOnOneSideAllowedError.js.map
