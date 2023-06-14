import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var UpdateValuesMissingError = /** @class */ (function (_super) {
    __extends(UpdateValuesMissingError, _super);
    function UpdateValuesMissingError() {
        return _super.call(this, "Cannot perform update query because update values are not defined. Call \"qb.set(...)\" method to specify updated values.") || this;
    }
    return UpdateValuesMissingError;
}(TypeORMError));
export { UpdateValuesMissingError };

//# sourceMappingURL=UpdateValuesMissingError.js.map
