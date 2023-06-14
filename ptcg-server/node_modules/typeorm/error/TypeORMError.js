"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORMError = void 0;
var tslib_1 = require("tslib");
var TypeORMError = /** @class */ (function (_super) {
    tslib_1.__extends(TypeORMError, _super);
    function TypeORMError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        // restore prototype chain because the base `Error` type
        // will break the prototype chain a little
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(_this, _newTarget.prototype);
        }
        else {
            _this.__proto__ = _newTarget.prototype;
        }
        return _this;
    }
    Object.defineProperty(TypeORMError.prototype, "name", {
        get: function () {
            return this.constructor.name;
        },
        enumerable: false,
        configurable: true
    });
    return TypeORMError;
}(Error));
exports.TypeORMError = TypeORMError;

//# sourceMappingURL=TypeORMError.js.map
