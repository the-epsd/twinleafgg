import { __awaiter, __extends, __generator } from "tslib";
import { QueryRunnerAlreadyReleasedError } from "../../error/QueryRunnerAlreadyReleasedError";
import { QueryFailedError } from "../../error/QueryFailedError";
import { AbstractSqliteQueryRunner } from "../sqlite-abstract/AbstractSqliteQueryRunner";
import { Broadcaster } from "../../subscriber/Broadcaster";
import { QueryResult } from "../../query-runner/QueryResult";
/**
 * Runs queries on a single sqlite database connection.
 */
var NativescriptQueryRunner = /** @class */ (function (_super) {
    __extends(NativescriptQueryRunner, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function NativescriptQueryRunner(driver) {
        var _this = _super.call(this) || this;
        _this.driver = driver;
        _this.connection = driver.connection;
        _this.broadcaster = new Broadcaster(_this);
        return _this;
    }
    /**
     * Executes a given SQL query.
     */
    NativescriptQueryRunner.prototype.query = function (query, parameters, useStructuredResult) {
        if (useStructuredResult === void 0) { useStructuredResult = false; }
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError();
                connection = this.driver.connection;
                return [2 /*return*/, new Promise(function (ok, fail) {
                        var isInsertQuery = query.substr(0, 11) === "INSERT INTO";
                        var handler = function (err, raw) {
                            // log slow queries if maxQueryExecution time is set
                            var maxQueryExecutionTime = this.driver.options.maxQueryExecutionTime;
                            var queryEndTime = +new Date();
                            var queryExecutionTime = queryEndTime - queryStartTime;
                            if (maxQueryExecutionTime && queryExecutionTime > maxQueryExecutionTime)
                                connection.logger.logQuerySlow(queryExecutionTime, query, parameters, this);
                            if (err) {
                                connection.logger.logQueryError(err, query, parameters, this);
                                fail(new QueryFailedError(query, parameters, err));
                            }
                            else {
                                var result = new QueryResult();
                                result.raw = raw;
                                if (!isInsertQuery && Array.isArray(raw)) {
                                    result.records = raw;
                                }
                                if (useStructuredResult) {
                                    ok(result);
                                }
                                else {
                                    ok(result.raw);
                                }
                            }
                        };
                        _this.driver.connection.logger.logQuery(query, parameters, _this);
                        var queryStartTime = +new Date();
                        _this.connect().then(function (databaseConnection) {
                            if (isInsertQuery) {
                                databaseConnection.execSQL(query, parameters, handler);
                            }
                            else {
                                databaseConnection.all(query, parameters, handler);
                            }
                        });
                    })];
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Parametrizes given object of values. Used to create column=value queries.
     */
    NativescriptQueryRunner.prototype.parametrize = function (objectLiteral, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        return Object.keys(objectLiteral).map(function (key, index) { return "\"" + key + "\"" + "=?"; });
    };
    return NativescriptQueryRunner;
}(AbstractSqliteQueryRunner));
export { NativescriptQueryRunner };

//# sourceMappingURL=NativescriptQueryRunner.js.map
