import { __assign, __extends, __rest } from "tslib";
import { ObjectUtils } from "../util/ObjectUtils";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when query execution has failed.
*/
var QueryFailedError = /** @class */ (function (_super) {
    __extends(QueryFailedError, _super);
    function QueryFailedError(query, parameters, driverError) {
        var _this = _super.call(this, driverError.toString()
            .replace(/^error: /, "")
            .replace(/^Error: /, "")
            .replace(/^Request/, "")) || this;
        _this.query = query;
        _this.parameters = parameters;
        _this.driverError = driverError;
        if (driverError) {
            var _ = driverError.name, // eslint-disable-line
            otherProperties = __rest(driverError, ["name"]);
            ObjectUtils.assign(_this, __assign({}, otherProperties));
        }
        return _this;
    }
    return QueryFailedError;
}(TypeORMError));
export { QueryFailedError };

//# sourceMappingURL=QueryFailedError.js.map
