"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = exports.Validator = exports.Validate = void 0;
const errors_1 = require("../common/errors");
const EMAIL_PATTERN = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
const NAME_PATTERN = /^[a-zA-Z0-9]{3,32}$/;
const PASSWORD_PATTERN = /^[^\s]{5,32}$/;
const NUMBER_PATTERN = /^\d+$/;
function Validate(validationMap) {
    return function (target, propertyKey, descriptor) {
        const handler = descriptor.value;
        if (handler === undefined) {
            return;
        }
        descriptor.value = function (req, res) {
            req.body = req.body || {};
            for (const param in validationMap) {
                if (Object.prototype.hasOwnProperty.call(validationMap, param)) {
                    const value = req.body[param];
                    if (!validationMap[param].validate(value)) {
                        res.statusCode = 400;
                        res.send({ error: errors_1.ApiErrorEnum.VALIDATION_INVALID_PARAM, param });
                        return;
                    }
                }
            }
            return handler.apply(this, arguments);
        };
    };
}
exports.Validate = Validate;
class Validator {
    constructor() {
        this.valid = true;
        this.validators = [];
    }
    validate(value) {
        for (let i = 0; i < this.validators.length; i++) {
            if (this.validators[i](value) === false) {
                return false;
            }
        }
        return true;
    }
    required() {
        this.validators.push((value) => !!value);
        return this;
    }
    isString() {
        this.validators.push((value) => {
            return (typeof value === 'string');
        });
        return this;
    }
    isBoolean() {
        this.validators.push((value) => {
            return (typeof value === 'boolean');
        });
        return this;
    }
    isNumber() {
        this.validators.push((value) => {
            return (typeof value === 'number');
        });
        return this;
    }
    minLength(len) {
        this.isString();
        this.validators.push((value) => {
            return value.trim().length >= len;
        });
        return this;
    }
    maxLength(len) {
        this.isString();
        this.validators.push((value) => {
            return value.trim().length <= len;
        });
        return this;
    }
    pattern(pattern) {
        this.isString();
        this.validators.push((value) => {
            return pattern.test(value);
        });
        return this;
    }
    isEmail() {
        return this.pattern(EMAIL_PATTERN);
    }
    isName() {
        return this.pattern(NAME_PATTERN);
    }
    isPassword() {
        return this.pattern(PASSWORD_PATTERN);
    }
    isInt() {
        this.isNumber();
        this.validators.push((value) => {
            const pattern = NUMBER_PATTERN;
            return pattern.test(String(value));
        });
        return this;
    }
}
exports.Validator = Validator;
function check() {
    return new Validator();
}
exports.check = check;
