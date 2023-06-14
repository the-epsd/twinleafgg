import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var TreeRepositoryNotSupportedError = /** @class */ (function (_super) {
    __extends(TreeRepositoryNotSupportedError, _super);
    function TreeRepositoryNotSupportedError(driver) {
        return _super.call(this, "Tree repositories are not supported in " + driver.options.type + " driver.") || this;
    }
    return TreeRepositoryNotSupportedError;
}(TypeORMError));
export { TreeRepositoryNotSupportedError };

//# sourceMappingURL=TreeRepositoryNotSupportedError.js.map
