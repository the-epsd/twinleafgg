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
export { DeleteResult };

//# sourceMappingURL=DeleteResult.js.map
