"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoConnectionOptionError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when some option is not set in the connection options.
 */
var NoConnectionOptionError = /** @class */ (function (_super) {
    tslib_1.__extends(NoConnectionOptionError, _super);
    function NoConnectionOptionError(optionName) {
        return _super.call(this, "Option \"" + optionName + "\" is not set in your connection options, please " +
            ("define \"" + optionName + "\" option in your connection options or ormconfig.json")) || this;
    }
    return NoConnectionOptionError;
}(TypeORMError_1.TypeORMError));
exports.NoConnectionOptionError = NoConnectionOptionError;

//# sourceMappingURL=NoConnectionOptionError.js.map
