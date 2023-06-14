"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataWithSuchNameAlreadyExistsError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var MetadataWithSuchNameAlreadyExistsError = /** @class */ (function (_super) {
    tslib_1.__extends(MetadataWithSuchNameAlreadyExistsError, _super);
    function MetadataWithSuchNameAlreadyExistsError(metadataType, name) {
        return _super.call(this, metadataType + " metadata with such name " + name + " already exists. " +
            "Do you apply decorator twice? Or maybe try to change a name?") || this;
    }
    return MetadataWithSuchNameAlreadyExistsError;
}(TypeORMError_1.TypeORMError));
exports.MetadataWithSuchNameAlreadyExistsError = MetadataWithSuchNameAlreadyExistsError;

//# sourceMappingURL=MetadataWithSuchNameAlreadyExistsError.js.map
