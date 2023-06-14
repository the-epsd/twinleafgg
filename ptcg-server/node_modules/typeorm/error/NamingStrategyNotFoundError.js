"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamingStrategyNotFoundError = void 0;
var tslib_1 = require("tslib");
var TypeORMError_1 = require("./TypeORMError");
/**
 * Thrown when consumer tries to use naming strategy that does not exist.
 */
var NamingStrategyNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(NamingStrategyNotFoundError, _super);
    function NamingStrategyNotFoundError(strategyName, connectionName) {
        var _this = _super.call(this) || this;
        var name = strategyName instanceof Function ? strategyName.name : strategyName;
        _this.message = "Naming strategy \"" + name + "\" was not found. Looks like this naming strategy does not " +
            ("exist or it was not registered in current \"" + connectionName + "\" connection?");
        return _this;
    }
    return NamingStrategyNotFoundError;
}(TypeORMError_1.TypeORMError));
exports.NamingStrategyNotFoundError = NamingStrategyNotFoundError;

//# sourceMappingURL=NamingStrategyNotFoundError.js.map
