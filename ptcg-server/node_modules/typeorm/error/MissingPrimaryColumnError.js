"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingPrimaryColumnError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var MissingPrimaryColumnError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingPrimaryColumnError, _super);
    function MissingPrimaryColumnError(entityMetadata) {
        return _super.call(this, "Entity \"" + entityMetadata.name + "\" does not have a primary column. Primary column is required to " +
            "have in all your entities. Use @PrimaryColumn decorator to add a primary column to your entity.") || this;
    }
    return MissingPrimaryColumnError;
}(TypeORMError_1.TypeORMError));
exports.MissingPrimaryColumnError = MissingPrimaryColumnError;

//# sourceMappingURL=MissingPrimaryColumnError.js.map
