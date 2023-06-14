import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var MetadataAlreadyExistsError = /** @class */ (function (_super) {
    __extends(MetadataAlreadyExistsError, _super);
    function MetadataAlreadyExistsError(metadataType, constructor, propertyName) {
        return _super.call(this, metadataType + " metadata already exists for the class constructor " + JSON.stringify(constructor) +
            (propertyName ? " on property " + propertyName : ". If you previously renamed or moved entity class, make sure" +
                " that compiled version of old entity class source wasn't left in the compiler output directory.")) || this;
    }
    return MetadataAlreadyExistsError;
}(TypeORMError));
export { MetadataAlreadyExistsError };

//# sourceMappingURL=MetadataAlreadyExistsError.js.map
