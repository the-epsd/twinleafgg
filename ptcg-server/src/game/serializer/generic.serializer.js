"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.GenericSerializer = void 0;
var GenericSerializer = /** @class */ (function () {
    function GenericSerializer(creatorClass, constructorName) {
        this.creatorClass = creatorClass;
        this.constructorName = constructorName;
        this.types = [constructorName];
        this.classes = [creatorClass];
    }
    GenericSerializer.prototype.serialize = function (state) {
        var constructorName = this.constructorName;
        return __assign({ _type: constructorName }, state);
    };
    GenericSerializer.prototype.deserialize = function (data, context) {
        var instance = new this.creatorClass();
        delete data._type;
        return Object.assign(instance, data);
    };
    return GenericSerializer;
}());
exports.GenericSerializer = GenericSerializer;
