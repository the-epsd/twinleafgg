"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnTypeUndefinedError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when ORM cannot get column's type automatically.
 * Basically, when reflect-metadata is not available or tsconfig is not properly setup.
 */
var ColumnTypeUndefinedError = /** @class */ (function (_super) {
    tslib_1.__extends(ColumnTypeUndefinedError, _super);
    function ColumnTypeUndefinedError(object, propertyName) {
        return _super.call(this, "Column type for " + object.constructor.name + "#" + propertyName + " is not defined and cannot be guessed. " +
            "Make sure you have turned on an \"emitDecoratorMetadata\": true option in tsconfig.json. " +
            "Also make sure you have imported \"reflect-metadata\" on top of the main entry file in your application (before any entity imported)." +
            "If you are using JavaScript instead of TypeScript you must explicitly provide a column type.") || this;
    }
    return ColumnTypeUndefinedError;
}(TypeORMError_1.TypeORMError));
exports.ColumnTypeUndefinedError = ColumnTypeUndefinedError;

//# sourceMappingURL=ColumnTypeUndefinedError.js.map
