import { __extends } from "tslib";
var TypeORMError = /** @class */ (function (_super) {
    __extends(TypeORMError, _super);
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
export { TypeORMError };

//# sourceMappingURL=TypeORMError.js.map
