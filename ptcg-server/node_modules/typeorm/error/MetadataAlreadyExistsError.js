"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataAlreadyExistsError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var MetadataAlreadyExistsError = /** @class */ (function (_super) {
    tslib_1.__extends(MetadataAlreadyExistsError, _super);
    function MetadataAlreadyExistsError(metadataType, constructor, propertyName) {
        return _super.call(this, metadataType + " metadata already exists for the class constructor " + JSON.stringify(constructor) +
            (propertyName ? " on property " + propertyName : ". If you previously renamed or moved entity class, make sure" +
                " that compiled version of old entity class source wasn't left in the compiler output directory.")) || this;
    }
    return MetadataAlreadyExistsError;
}(TypeORMError_1.TypeORMError));
exports.MetadataAlreadyExistsError = MetadataAlreadyExistsError;

//# sourceMappingURL=MetadataAlreadyExistsError.js.map
