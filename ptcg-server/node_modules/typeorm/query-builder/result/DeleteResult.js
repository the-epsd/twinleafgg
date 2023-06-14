"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteResult = void 0;
/**
 * Result object returned by DeleteQueryBuilder execution.
 */
var DeleteResult = /** @class */ (function () {
    function DeleteResult() {
    }
    DeleteResult.from = function (queryResult) {
        var result = new this();
        result.raw = queryResult.records;
        result.affected = queryResult.affected;
        return result;
    };
    return DeleteResult;
}());
exports.DeleteResult = DeleteResult;

//# sourceMappingURL=DeleteResult.js.map
