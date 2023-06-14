"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapacitorQueryRunner = void 0;
var tslib_1 = require("tslib");
var QueryRunnerAlreadyReleasedError_1 = require("../../error/QueryRunnerAlreadyReleasedError");
var QueryFailedError_1 = require("../../error/QueryFailedError");
var AbstractSqliteQueryRunner_1 = require("../sqlite-abstract/AbstractSqliteQueryRunner");
var Broadcaster_1 = require("../../subscriber/Broadcaster");
var QueryResult_1 = require("../../query-runner/QueryResult");
/**
 * Runs queries on a single sqlite database connection.
 */
var CapacitorQueryRunner = /** @class */ (function (_super) {
    tslib_1.__extends(CapacitorQueryRunner, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function CapacitorQueryRunner(driver) {
        var _this = _super.call(this) || this;
        _this.driver = driver;
        _this.connection = driver.connection;
        _this.broadcaster = new Broadcaster_1.Broadcaster(_this);
        return _this;
    }
    CapacitorQueryRunner.prototype.executeSet = function (set) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var databaseConnection;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var databaseConnection, command, raw, result, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReleased)
                            throw new QueryRunnerAlreadyReleasedError_1.QueryRunnerAlreadyReleasedError();
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
                        result = new QueryResult_1.QueryResult();
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
                        throw new QueryFailedError_1.QueryFailedError(query, parameters, err_1);
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
}(AbstractSqliteQueryRunner_1.AbstractSqliteQueryRunner));
exports.CapacitorQueryRunner = CapacitorQueryRunner;

//# sourceMappingURL=CapacitorQueryRunner.js.map
