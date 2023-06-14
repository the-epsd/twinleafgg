import { __extends } from "tslib";
import { TypeORMError } from "./TypeORMError";
/**
 * Thrown when operation is going to be executed on a subject without identifier.
 * This error should never be thrown, however it still presents to prevent user from updation or removing the whole table.
 * If this error occurs still, it most probably is an ORM internal problem which must be reported and fixed.
 */
var SubjectWithoutIdentifierError = /** @class */ (function (_super) {
    __extends(SubjectWithoutIdentifierError, _super);
    function SubjectWithoutIdentifierError(subject) {
        return _super.call(this, "Internal error. Subject " + subject.metadata.targetName + " must have an identifier to perform operation.") || this;
    }
    return SubjectWithoutIdentifierError;
}(TypeORMError));
export { SubjectWithoutIdentifierError };

//# sourceMappingURL=SubjectWithoutIdentifierError.js.map
