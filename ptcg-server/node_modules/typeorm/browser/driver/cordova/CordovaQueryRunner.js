import { __awaiter, __extends, __generator } from "tslib";
import { QueryRunnerAlreadyReleasedError } from "../../error/QueryRunnerAlreadyReleasedError";
import { QueryFailedError } from "../../error/QueryFailedError";
import { AbstractSqliteQueryRunner } from "../sqlite-abstract/AbstractSqliteQueryRunner";
import { Broadcaster } from "../../subscriber/Broadcaster";
import { TypeORMError } from "../../error";
import { QueryResult } from "../../query-runner/QueryResult";
/**
 * Runs queries on a single sqlite database connection.
 */
var CordovaQueryRunner = /** @class */ (function (_super) {
    __extends(CordovaQueryRunner, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function CordovaQueryRunner(driver) {
        var _this = _super.call(this) || this;
        _this.driver = driver;
        _this.connection = driver.connection;
        _this.broadcaster = new Broadcaster(_this);
        return _this;
    }
    /**
     * Executes a given SQL query.
     */
    CordovaQueryRunner.prototype.query = function (query, parameters, useStructuredResult) {
        if (useStructuredResult === void 0) { useStructuredResult = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.isReleased)
                    throw new QueryRunnerAlreadyReleasedError();
                return [2 /*return*/, new Promise(function (ok, fail) { return __awaiter(_this, void 0, void 0, function () {
                        var databaseConnection, queryStartTime;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.connect()];
                                case 1:
                                    databaseConnection = _a.sent();
                                    this.driver.connection.logger.logQuery(query, parameters, this);
                                    queryStartTime = +new Date();
                                    databaseConnection.executeSql(query, parameters, function (raw) {
                                        // log slow queries if maxQueryExecution time is set
                                        var maxQueryExecutionTime = _this.driver.options.maxQueryExecutionTime;
                                        var queryEndTime = +new Date();
                                        var queryExecutionTime = queryEndTime - queryStartTime;
                                        if (maxQueryExecutionTime && queryExecutionTime > maxQueryExecutionTime)
                                            _this.driver.connection.logger.logQuerySlow(queryExecutionTime, query, parameters, _this);
                                        var result = new QueryResult();
                                        if (query.substr(0, 11) === "INSERT INTO") {
                                            result.raw = raw.insertId;
                                        }
                                        else {
                                            var resultSet = [];
                                            for (var i = 0; i < raw.rows.length; i++) {
                                                resultSet.push(raw.rows.item(i));
                                            }
                                            result.records = resultSet;
                                            result.raw = resultSet;
                                        }
                                        if (useStructuredResult) {
                                            ok(result);
                                        }
                                        else {
                                            ok(result.raw);
                                        }
                                    }, function (err) {
                                        _this.driver.connection.logger.logQueryError(err, query, parameters, _this);
                                        fail(new QueryFailedError(query, parameters, err));
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Insert a new row with given values into the given table.
     * Returns value of the generated column if given and generate column exist in the table.
     // todo: implement new syntax
    async insert(tableName: string, keyValues: ObjectLiteral): Promise<InsertResult> {
        const keys = Object.keys(keyValues);
        const columns = keys.map(key => `"${key}"`).join(", ");
        const values = keys.map(key => "?").join(",");
        const generatedColumns = this.connection.hasMetadata(tableName) ? this.connection.getMetadata(tableName).generatedColumns : [];
        const sql = columns.length > 0 ? (`INSERT INTO "${tableName}"(${columns}) VALUES (${values})`) : `INSERT INTO "${tableName}" DEFAULT VALUES`;
        const parameters = keys.map(key => keyValues[key]);

        return new Promise<InsertResult>(async (ok, fail) => {
            this.driver.connection.logger.logQuery(sql, parameters, this);
            const __this = this;
            const databaseConnection = await this.connect();
            databaseConnection.executeSql(sql, parameters, (resultSet: any) => {
                const generatedMap = generatedColumns.reduce((map, generatedColumn) => {
                    const value = generatedColumn.isPrimary && generatedColumn.generationStrategy === "increment" && resultSet.insertId ? resultSet.insertId : keyValues[generatedColumn.databaseName];
                    if (!value) return map;
                    return OrmUtils.mergeDeep(map, generatedColumn.createValueMap(value));
                }, {} as ObjectLiteral);

                ok({
                    result: undefined,
                    generatedMap: Object.keys(generatedMap).length > 0 ? generatedMap : undefined
                });
            }, (err: any) => {
                __this.driver.connection.logger.logQueryError(err, sql, parameters, this);
                fail(err);
            });
        });
    }*/
    /**
     * Would start a transaction but this driver does not support transactions.
     */
    CordovaQueryRunner.prototype.startTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new TypeORMError('Transactions are not supported by the Cordova driver');
            });
        });
    };
    /**
     * Would start a transaction but this driver does not support transactions.
     */
    CordovaQueryRunner.prototype.commitTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new TypeORMError('Transactions are not supported by the Cordova driver');
            });
        });
    };
    /**
     * Would start a transaction but this driver does not support transactions.
     */
    CordovaQueryRunner.prototype.rollbackTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new TypeORMError('Transactions are not supported by the Cordova driver');
            });
        });
    };
    /**
     * Removes all tables from the currently connected database.
     * Be careful with using this method and avoid using it in production or migrations
     * (because it can clear all your database).
     */
    CordovaQueryRunner.prototype.clearDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var selectViewDropsQuery, dropViewQueries, selectTableDropsQuery, dropTableQueries;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query("PRAGMA foreign_keys = OFF;")];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 7, 9]);
                        selectViewDropsQuery = "SELECT 'DROP VIEW \"' || name || '\";' as query FROM \"sqlite_master\" WHERE \"type\" = 'view'";
                        return [4 /*yield*/, this.query(selectViewDropsQuery)];
                    case 3:
                        dropViewQueries = _a.sent();
                        selectTableDropsQuery = "SELECT 'DROP TABLE \"' || name || '\";' as query FROM \"sqlite_master\" WHERE \"type\" = 'table' AND \"name\" != 'sqlite_sequence'";
                        return [4 /*yield*/, this.query(selectTableDropsQuery)];
                    case 4:
                        dropTableQueries = _a.sent();
                        return [4 /*yield*/, Promise.all(dropViewQueries.map(function (q) { return _this.query(q["query"]); }))];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(dropTableQueries.map(function (q) { return _this.query(q["query"]); }))];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.query("PRAGMA foreign_keys = ON;")];
                    case 8:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
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
    CordovaQueryRunner.prototype.parametrize = function (objectLiteral, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        return Object.keys(objectLiteral).map(function (key, index) { return "\"" + key + "\"" + "=?"; });
    };
    return CordovaQueryRunner;
}(AbstractSqliteQueryRunner));
export { CordovaQueryRunner };

//# sourceMappingURL=CordovaQueryRunner.js.map
