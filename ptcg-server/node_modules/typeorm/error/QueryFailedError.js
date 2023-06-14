"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryFailedError = void 0;
var tslib_1 = require("tslib");
var ObjectUtils_1 = require("../util/ObjectUtils");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when query execution has failed.
*/
var QueryFailedError = /** @class */ (function (_super) {
    tslib_1.__extends(QueryFailedError, _super);
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
            otherProperties = tslib_1.__rest(driverError, ["name"]);
            ObjectUtils_1.ObjectUtils.assign(_this, tslib_1.__assign({}, otherProperties));
        }
        return _this;
    }
    return QueryFailedError;
}(TypeORMError_1.TypeORMError));
exports.QueryFailedError = QueryFailedError;

//# sourceMappingURL=QueryFailedError.js.map
