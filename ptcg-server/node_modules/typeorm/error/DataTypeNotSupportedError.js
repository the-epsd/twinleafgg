"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTypeNotSupportedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
var DataTypeNotSupportedError = /** @class */ (function (_super) {
    tslib_1.__extends(DataTypeNotSupportedError, _super);
    function DataTypeNotSupportedError(column, dataType, database) {
        var _this = _super.call(this) || this;
        var type = typeof dataType === "string" ? dataType : dataType.name;
        _this.message = "Data type \"" + type + "\" in \"" + column.entityMetadata.targetName + "." + column.propertyName + "\" is not supported by \"" + database + "\" database.";
        return _this;
    }
    return DataTypeNotSupportedError;
}(TypeORMError_1.TypeORMError));
exports.DataTypeNotSupportedError = DataTypeNotSupportedError;

//# sourceMappingURL=DataTypeNotSupportedError.js.map
