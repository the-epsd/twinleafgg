import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when some option is not set in the connection options.
 */
var NoConnectionOptionError = /** @class */ (function (_super) {
    __extends(NoConnectionOptionError, _super);
    function NoConnectionOptionError(optionName) {
        return _super.call(this, "Option \"" + optionName + "\" is not set in your connection options, please " +
            ("define \"" + optionName + "\" option in your connection options or ormconfig.json")) || this;
    }
    return NoConnectionOptionError;
}(TypeORMError));
export { NoConnectionOptionError };

//# sourceMappingURL=NoConnectionOptionError.js.map
