import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
var MissingDeleteDateColumnError = /** @class */ (function (_super) {
    __extends(MissingDeleteDateColumnError, _super);
    function MissingDeleteDateColumnError(entityMetadata) {
        return _super.call(this, "Entity \"" + entityMetadata.name + "\" does not have delete date columns.") || this;
    }
    return MissingDeleteDateColumnError;
}(TypeORMError));
export { MissingDeleteDateColumnError };

//# sourceMappingURL=MissingDeleteDateColumnError.js.map
