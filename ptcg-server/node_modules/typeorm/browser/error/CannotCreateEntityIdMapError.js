import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when user tries to create entity id map from the mixed id value,
 * but id value is a single value when entity requires multiple values.
 */
var CannotCreateEntityIdMapError = /** @class */ (function (_super) {
    __extends(CannotCreateEntityIdMapError, _super);
    function CannotCreateEntityIdMapError(metadata, id) {
        var _this = _super.call(this) || this;
        var objectExample = metadata.primaryColumns.reduce(function (object, column, index) {
            column.setEntityValue(object, index + 1);
            return object;
        }, {});
        _this.message = "Cannot use given entity id \"" + id + "\" because \"" + metadata.targetName + "\" contains multiple primary columns, you must provide object in following form: " + JSON.stringify(objectExample) + " as an id.";
        return _this;
    }
    return CannotCreateEntityIdMapError;
}(TypeORMError));
export { CannotCreateEntityIdMapError };

//# sourceMappingURL=CannotCreateEntityIdMapError.js.map
