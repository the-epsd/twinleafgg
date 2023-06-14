import { __awaiter, __extends, __generator } from "tslib";
import { QueryRunnerAlreadyReleasedError } from "../../error/QueryRunnerAlreadyReleasedError";
import { QueryFailedError } from "../../error/QueryFailedError";
import { AbstractSqliteQueryRunner } from "../sqlite-abstract/AbstractSqliteQueryRunner";
import { Broadcaster } from "../../subscriber/Broadcaster";
import { QueryResult } from "../../query-runner/QueryResult";
/**
 * Runs queries on a single sqlite database connection.
 */
var CapacitorQueryRunner = /** @class */ (function (_super) {
    __extends(CapacitorQueryRunner, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function CapacitorQueryRunner(driver) {
        var _this = _super.call(this) || this;
        _this.driver = driver;
        _this.connection = driver.connection;
        _this.broadcaster = new Broadcaster(_this);
        return _this;
    }
    CapacitorQueryRunner.prototype.executeSet = function (set) {
        return __awaiter(this, void 0, void 0, function () {
            var databaseConnection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError();
                        return [4 /*yield*/, this.connect()];
                    case 1:
                        databaseConnection = _a.sent();
                        return [2 /*return*/, databaseConnection.executeSet(set, false)];
                }
            });
        });
    };
    /**
     * Executes a given SQL query.
     */
    CapacitorQueryRunner.prototype.query = function (query, parameters, useStructuredResult) {
        if (useStructuredResult === void 0) { useStructuredResult = false; }
        return __awaiter(this, void 0, void 0, function () {
            var databaseConnection, command, raw, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError();
                        return [4 /*yield*/, this.connect()];
                    case 1:
                        databaseConnection = _a.sent();
                        this.driver.connection.logger.logQuery(query, parameters, this);
                        command = query.substr(0, query.indexOf(" "));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, , 10]);
                        raw = void 0;
                        if (!(["BEGIN", "ROLLBACK", "COMMIT", "CREATE", "ALTER", "DROP"].indexOf(command) !== -1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, databaseConnection.execute(query, false)];
                    case 3:
                        raw = _a.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(["INSERT", "UPDATE", "DELETE"].indexOf(command) !== -1)) return [3 /*break*/, 6];
                        return [4 /*yield*/, databaseConnection.run(query, parameters, false)];
                    case 5:
                        raw = _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, databaseConnection.query(query, parameters || [])];
                    case 7:
                        raw = _a.sent();
                        _a.label = 8;
                    case 8:
                        result = new QueryResult();
                        if (raw === null || raw === void 0 ? void 0 : raw.hasOwnProperty('values')) {
                            result.raw = raw.values;
                            result.records = raw.values;
                        }
                        if (raw === null || raw === void 0 ? void 0 : raw.hasOwnProperty('changes')) {
                            result.affected = raw.changes.changes;
                            result.raw = raw.changes.lastId || raw.changes.changes;
                        }
                        if (!useStructuredResult) {
                            return [2 /*return*/, result.raw];
                        }
                        return [2 /*return*/, result];
                    case 9:
                        err_1 = _a.sent();
                        this.driver.connection.logger.logQueryError(err_1, query, parameters, this);
                        throw new QueryFailedError(query, parameters, err_1);
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Parametrizes given object of values. Used to create column=value queries.
     */
    CapacitorQueryRunner.prototype.parametrize = function (objectLiteral) {
        return Object.keys(objectLiteral).map(function (key) { return "\"" + key + "\"" + "=?"; });
    };
    return CapacitorQueryRunner;
}(AbstractSqliteQueryRunner));
export { CapacitorQueryRunner };

//# sourceMappingURL=CapacitorQueryRunner.js.map
