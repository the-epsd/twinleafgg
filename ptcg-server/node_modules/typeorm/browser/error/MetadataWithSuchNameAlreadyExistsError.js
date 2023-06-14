import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var MetadataWithSuchNameAlreadyExistsError = /** @class */ (function (_super) {
    __extends(MetadataWithSuchNameAlreadyExistsError, _super);
    function MetadataWithSuchNameAlreadyExistsError(metadataType, name) {
        return _super.call(this, metadataType + " metadata with such name " + name + " already exists. " +
            "Do you apply decorator twice? Or maybe try to change a name?") || this;
    }
    return MetadataWithSuchNameAlreadyExistsError;
}(TypeORMError));
export { MetadataWithSuchNameAlreadyExistsError };

//# sourceMappingURL=MetadataWithSuchNameAlreadyExistsError.js.map
