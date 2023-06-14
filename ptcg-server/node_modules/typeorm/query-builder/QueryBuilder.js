"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
var tslib_1 = require("tslib");
var QueryExpressionMap_1 = require("./QueryExpressionMap");
var Brackets_1 = require("./Brackets");
var PostgresDriver_1 = require("../driver/postgres/PostgresDriver");
var CockroachDriver_1 = require("../driver/cockroachdb/CockroachDriver");
var SqlServerDriver_1 = require("../driver/sqlserver/SqlServerDriver");
var OracleDriver_1 = require("../driver/oracle/OracleDriver");
var EntitySchema_1 = require("../entity-schema/EntitySchema");
var FindOperator_1 = require("../find-options/FindOperator");
var In_1 = require("../find-options/operator/In");
var EntityColumnNotFound_1 = require("../error/EntityColumnNotFound");
var error_1 = require("../error");
// todo: completely cover query builder with tests
// todo: entityOrProperty can be target name. implement proper behaviour if it is.
// todo: check in persistment if id exist on object and throw exception (can be in partial selection?)
// todo: fix problem with long aliases eg getMaxIdentifierLength
// todo: fix replacing in .select("COUNT(post.id) AS cnt") statement
// todo: implement joinAlways in relations and relationId
// todo: finish partial selection
// todo: sugar methods like: .addCount and .selectCount, selectCountAndMap, selectSum, selectSumAndMap, ...
// todo: implement @Select decorator
// todo: add select and map functions
// todo: implement relation/entity loading and setting them into properties within a separate query
// .loadAndMap("post.categories", "post.categories", qb => ...)
// .loadAndMap("post.categories", Category, qb => ...)
/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
var QueryBuilder = /** @class */ (function () {
    /**
     * QueryBuilder can be initialized from given Connection and QueryRunner objects or from given other QueryBuilder.
     */
    function QueryBuilder(connectionOrQueryBuilder, queryRunner) {
        /**
         * Memo to help keep place of current parameter index for `createParameter`
         */
        this.parameterIndex = 0;
        if (connectionOrQueryBuilder instanceof QueryBuilder) {
            this.connection = connectionOrQueryBuilder.connection;
            this.queryRunner = connectionOrQueryBuilder.queryRunner;
            this.expressionMap = connectionOrQueryBuilder.expressionMap.clone();
        }
        else {
            this.connection = connectionOrQueryBuilder;
            this.queryRunner = queryRunner;
            this.expressionMap = new QueryExpressionMap_1.QueryExpressionMap(this.connection);
        }
    }
    Object.defineProperty(QueryBuilder.prototype, "alias", {
        // -------------------------------------------------------------------------
        // Accessors
        // -------------------------------------------------------------------------
        /**
         * Gets the main alias string used in this query builder.
         */
        get: function () {
            if (!this.expressionMap.mainAlias)
                throw new error_1.TypeORMError("Main alias is not set"); // todo: better exception
            return this.expressionMap.mainAlias.name;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Creates SELECT query and selects given data.
     * Replaces all previous selections if they exist.
     */
    QueryBuilder.prototype.select = function (selection, selectionAliasName) {
        this.expressionMap.queryType = "select";
        if (Array.isArray(selection)) {
            this.expressionMap.selects = selection.map(function (selection) { return ({ selection: selection }); });
        }
        else if (selection) {
            this.expressionMap.selects = [{ selection: selection, aliasName: selectionAliasName }];
        }
        // loading it dynamically because of circular issue
        var SelectQueryBuilderCls = require("./SelectQueryBuilder").SelectQueryBuilder;
        if (this instanceof SelectQueryBuilderCls)
            return this;
        return new SelectQueryBuilderCls(this);
    };
    /**
     * Creates INSERT query.
     */
    QueryBuilder.prototype.insert = function () {
        this.expressionMap.queryType = "insert";
        // loading it dynamically because of circular issue
        var InsertQueryBuilderCls = require("./InsertQueryBuilder").InsertQueryBuilder;
        if (this instanceof InsertQueryBuilderCls)
            return this;
        return new InsertQueryBuilderCls(this);
    };
    /**
     * Creates UPDATE query and applies given update values.
     */
    QueryBuilder.prototype.update = function (entityOrTableNameUpdateSet, maybeUpdateSet) {
        var updateSet = maybeUpdateSet ? maybeUpdateSet : entityOrTableNameUpdateSet;
        entityOrTableNameUpdateSet = entityOrTableNameUpdateSet instanceof EntitySchema_1.EntitySchema ? entityOrTableNameUpdateSet.options.name : entityOrTableNameUpdateSet;
        if (entityOrTableNameUpdateSet instanceof Function || typeof entityOrTableNameUpdateSet === "string") {
            var mainAlias = this.createFromAlias(entityOrTableNameUpdateSet);
            this.expressionMap.setMainAlias(mainAlias);
        }
        this.expressionMap.queryType = "update";
        this.expressionMap.valuesSet = updateSet;
        // loading it dynamically because of circular issue
        var UpdateQueryBuilderCls = require("./UpdateQueryBuilder").UpdateQueryBuilder;
        if (this instanceof UpdateQueryBuilderCls)
            return this;
        return new UpdateQueryBuilderCls(this);
    };
    /**
     * Creates DELETE query.
     */
    QueryBuilder.prototype.delete = function () {
        this.expressionMap.queryType = "delete";
        // loading it dynamically because of circular issue
        var DeleteQueryBuilderCls = require("./DeleteQueryBuilder").DeleteQueryBuilder;
        if (this instanceof DeleteQueryBuilderCls)
            return this;
        return new DeleteQueryBuilderCls(this);
    };
    QueryBuilder.prototype.softDelete = function () {
        this.expressionMap.queryType = "soft-delete";
        // loading it dynamically because of circular issue
        var SoftDeleteQueryBuilderCls = require("./SoftDeleteQueryBuilder").SoftDeleteQueryBuilder;
        if (this instanceof SoftDeleteQueryBuilderCls)
            return this;
        return new SoftDeleteQueryBuilderCls(this);
    };
    QueryBuilder.prototype.restore = function () {
        this.expressionMap.queryType = "restore";
        // loading it dynamically because of circular issue
        var SoftDeleteQueryBuilderCls = require("./SoftDeleteQueryBuilder").SoftDeleteQueryBuilder;
        if (this instanceof SoftDeleteQueryBuilderCls)
            return this;
        return new SoftDeleteQueryBuilderCls(this);
    };
    /**
     * Sets entity's relation with which this query builder gonna work.
     */
    QueryBuilder.prototype.relation = function (entityTargetOrPropertyPath, maybePropertyPath) {
        var entityTarget = arguments.length === 2 ? entityTargetOrPropertyPath : undefined;
        var propertyPath = arguments.length === 2 ? maybePropertyPath : entityTargetOrPropertyPath;
        this.expressionMap.queryType = "relation";
        this.expressionMap.relationPropertyPath = propertyPath;
        if (entityTarget) {
            var mainAlias = this.createFromAlias(entityTarget);
            this.expressionMap.setMainAlias(mainAlias);
        }
        // loading it dynamically because of circular issue
        var RelationQueryBuilderCls = require("./RelationQueryBuilder").RelationQueryBuilder;
        if (this instanceof RelationQueryBuilderCls)
            return this;
        return new RelationQueryBuilderCls(this);
    };
    /**
     * Checks if given relation or relations exist in the entity.
     * Returns true if relation exists, false otherwise.
     *
     * todo: move this method to manager? or create a shortcut?
     */
    QueryBuilder.prototype.hasRelation = function (target, relation) {
        var entityMetadata = this.connection.getMetadata(target);
        var relations = Array.isArray(relation) ? relation : [relation];
        return relations.every(function (relation) {
            return !!entityMetadata.findRelationWithPropertyPath(relation);
        });
    };
    /**
     * Check the existence of a parameter for this query builder.
     */
    QueryBuilder.prototype.hasParameter = function (key) {
        var _a;
        return ((_a = this.parentQueryBuilder) === null || _a === void 0 ? void 0 : _a.hasParameter(key)) || key in this.expressionMap.parameters;
    };
    /**
     * Sets parameter name and its value.
     *
     * The key for this parametere may contain numbers, letters, underscores, or periods.
     */
    QueryBuilder.prototype.setParameter = function (key, value) {
        if (value instanceof Function) {
            throw new error_1.TypeORMError("Function parameter isn't supported in the parameters. Please check \"" + key + "\" parameter.");
        }
        if (!key.match(/^([A-Za-z0-9_.]+)$/)) {
            throw new error_1.TypeORMError("QueryBuilder parameter keys may only contain numbers, letters, underscores, or periods.");
        }
        if (this.parentQueryBuilder) {
            this.parentQueryBuilder.setParameter(key, value);
        }
        this.expressionMap.parameters[key] = value;
        return this;
    };
    /**
     * Adds all parameters from the given object.
     */
    QueryBuilder.prototype.setParameters = function (parameters) {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(Object.entries(parameters)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = tslib_1.__read(_c.value, 2), key = _d[0], value = _d[1];
                this.setParameter(key, value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    QueryBuilder.prototype.createParameter = function (value) {
        var parameterName;
        do {
            parameterName = "orm_param_" + this.parameterIndex++;
        } while (this.hasParameter(parameterName));
        this.setParameter(parameterName, value);
        return ":" + parameterName;
    };
    /**
     * Adds native parameters from the given object.
     *
     * @deprecated Use `setParameters` instead
     */
    QueryBuilder.prototype.setNativeParameters = function (parameters) {
        var _this = this;
        // set parent query builder parameters as well in sub-query mode
        if (this.parentQueryBuilder) {
            this.parentQueryBuilder.setNativeParameters(parameters);
        }
        Object.keys(parameters).forEach(function (key) {
            _this.expressionMap.nativeParameters[key] = parameters[key];
        });
        return this;
    };
    /**
     * Gets all parameters.
     */
    QueryBuilder.prototype.getParameters = function () {
        var parameters = Object.assign({}, this.expressionMap.parameters);
        // add discriminator column parameter if it exist
        if (this.expressionMap.mainAlias && this.expressionMap.mainAlias.hasMetadata) {
            var metadata = this.expressionMap.mainAlias.metadata;
            if (metadata.discriminatorColumn && metadata.parentEntityMetadata) {
                var values = metadata.childEntityMetadatas
                    .filter(function (childMetadata) { return childMetadata.discriminatorColumn; })
                    .map(function (childMetadata) { return childMetadata.discriminatorValue; });
                values.push(metadata.discriminatorValue);
                parameters["discriminatorColumnValues"] = values;
            }
        }
        return parameters;
    };
    /**
     * Prints sql to stdout using console.log.
     */
    QueryBuilder.prototype.printSql = function () {
        var _a = tslib_1.__read(this.getQueryAndParameters(), 2), query = _a[0], parameters = _a[1];
        this.connection.logger.logQuery(query, parameters);
        return this;
    };
    /**
     * Gets generated sql that will be executed.
     * Parameters in the query are escaped for the currently used driver.
     */
    QueryBuilder.prototype.getSql = function () {
        return this.getQueryAndParameters()[0];
    };
    /**
     * Gets query to be executed with all parameters used in it.
     */
    QueryBuilder.prototype.getQueryAndParameters = function () {
        // this execution order is important because getQuery method generates this.expressionMap.nativeParameters values
        var query = this.getQuery();
        var parameters = this.getParameters();
        return this.connection.driver.escapeQueryWithParameters(query, parameters, this.expressionMap.nativeParameters);
    };
    /**
     * Executes sql generated by query builder and returns raw database results.
     */
    QueryBuilder.prototype.execute = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, sql, parameters, queryRunner;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = tslib_1.__read(this.getQueryAndParameters(), 2), sql = _a[0], parameters = _a[1];
                        queryRunner = this.obtainQueryRunner();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 3, 6]);
                        return [4 /*yield*/, queryRunner.query(sql, parameters)];
                    case 2: return [2 /*return*/, _b.sent()]; // await is needed here because we are using finally
                    case 3:
                        if (!(queryRunner !== this.queryRunner)) return [3 /*break*/, 5];
                        return [4 /*yield*/, queryRunner.release()];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a completely new query builder.
     * Uses same query runner as current QueryBuilder.
     */
    QueryBuilder.prototype.createQueryBuilder = function () {
        return new this.constructor(this.connection, this.queryRunner);
    };
    /**
     * Clones query builder as it is.
     * Note: it uses new query runner, if you want query builder that uses exactly same query runner,
     * you can create query builder using its constructor, for example new SelectQueryBuilder(queryBuilder)
     * where queryBuilder is cloned QueryBuilder.
     */
    QueryBuilder.prototype.clone = function () {
        return new this.constructor(this);
    };
    /**
     * Includes a Query comment in the query builder.  This is helpful for debugging purposes,
     * such as finding a specific query in the database server's logs, or for categorization using
     * an APM product.
     */
    QueryBuilder.prototype.comment = function (comment) {
        this.expressionMap.comment = comment;
        return this;
    };
    /**
     * Disables escaping.
     */
    QueryBuilder.prototype.disableEscaping = function () {
        this.expressionMap.disableEscaping = false;
        return this;
    };
    /**
     * Escapes table name, column name or alias name using current database's escaping character.
     */
    QueryBuilder.prototype.escape = function (name) {
        if (!this.expressionMap.disableEscaping)
            return name;
        return this.connection.driver.escape(name);
    };
    /**
     * Sets or overrides query builder's QueryRunner.
     */
    QueryBuilder.prototype.setQueryRunner = function (queryRunner) {
        this.queryRunner = queryRunner;
        return this;
    };
    /**
     * Indicates if listeners and subscribers must be called before and after query execution.
     * Enabled by default.
     */
    QueryBuilder.prototype.callListeners = function (enabled) {
        this.expressionMap.callListeners = enabled;
        return this;
    };
    /**
     * If set to true the query will be wrapped into a transaction.
     */
    QueryBuilder.prototype.useTransaction = function (enabled) {
        this.expressionMap.useTransaction = enabled;
        return this;
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Gets escaped table name with schema name if SqlServer driver used with custom
     * schema name, otherwise returns escaped table name.
     */
    QueryBuilder.prototype.getTableName = function (tablePath) {
        var _this = this;
        return tablePath.split(".")
            .map(function (i) {
            // this condition need because in SQL Server driver when custom database name was specified and schema name was not, we got `dbName..tableName` string, and doesn't need to escape middle empty string
            if (i === "")
                return i;
            return _this.escape(i);
        }).join(".");
    };
    /**
     * Gets name of the table where insert should be performed.
     */
    QueryBuilder.prototype.getMainTableName = function () {
        if (!this.expressionMap.mainAlias)
            throw new error_1.TypeORMError("Entity where values should be inserted is not specified. Call \"qb.into(entity)\" method to specify it.");
        if (this.expressionMap.mainAlias.hasMetadata)
            return this.expressionMap.mainAlias.metadata.tablePath;
        return this.expressionMap.mainAlias.tablePath;
    };
    /**
     * Specifies FROM which entity's table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    QueryBuilder.prototype.createFromAlias = function (entityTarget, aliasName) {
        // if table has a metadata then find it to properly escape its properties
        // const metadata = this.connection.entityMetadatas.find(metadata => metadata.tableName === tableName);
        if (this.connection.hasMetadata(entityTarget)) {
            var metadata = this.connection.getMetadata(entityTarget);
            return this.expressionMap.createAlias({
                type: "from",
                name: aliasName,
                metadata: this.connection.getMetadata(entityTarget),
                tablePath: metadata.tablePath
            });
        }
        else {
            if (typeof entityTarget === "string") {
                var isSubquery = entityTarget.substr(0, 1) === "(" && entityTarget.substr(-1) === ")";
                return this.expressionMap.createAlias({
                    type: "from",
                    name: aliasName,
                    tablePath: !isSubquery ? entityTarget : undefined,
                    subQuery: isSubquery ? entityTarget : undefined,
                });
            }
            var subQueryBuilder = entityTarget(this.subQuery());
            this.setParameters(subQueryBuilder.getParameters());
            var subquery = subQueryBuilder.getQuery();
            return this.expressionMap.createAlias({
                type: "from",
                name: aliasName,
                subQuery: subquery
            });
        }
    };
    /**
     * Replaces all entity's propertyName to name in the given statement.
     */
    QueryBuilder.prototype.replacePropertyNames = function (statement) {
        var e_2, _a;
        var _this = this;
        // Escape special characters in regular expressions
        // Per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
        var escapeRegExp = function (s) { return s.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); };
        var _loop_1 = function (alias) {
            var e_3, _d, e_4, _e, e_5, _f, e_6, _g, e_7, _h, e_8, _j;
            if (!alias.hasMetadata)
                return "continue";
            var replaceAliasNamePrefix = this_1.expressionMap.aliasNamePrefixingEnabled ? alias.name + "." : "";
            var replacementAliasNamePrefix = this_1.expressionMap.aliasNamePrefixingEnabled ? this_1.escape(alias.name) + "." : "";
            var replacements = {};
            try {
                // Insert & overwrite the replacements from least to most relevant in our replacements object.
                // To do this we iterate and overwrite in the order of relevance.
                // Least to Most Relevant:
                // * Relation Property Path to first join column key
                // * Relation Property Path + Column Path
                // * Column Database Name
                // * Column Propety Name
                // * Column Property Path
                for (var _k = (e_3 = void 0, tslib_1.__values(alias.metadata.relations)), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var relation = _l.value;
                    if (relation.joinColumns.length > 0)
                        replacements[relation.propertyPath] = relation.joinColumns[0].databaseName;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_d = _k.return)) _d.call(_k);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                for (var _m = (e_4 = void 0, tslib_1.__values(alias.metadata.relations)), _o = _m.next(); !_o.done; _o = _m.next()) {
                    var relation = _o.value;
                    try {
                        for (var _p = (e_5 = void 0, tslib_1.__values(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(relation.joinColumns)), tslib_1.__read(relation.inverseJoinColumns)))), _q = _p.next(); !_q.done; _q = _p.next()) {
                            var joinColumn = _q.value;
                            var propertyKey = relation.propertyPath + "." + joinColumn.referencedColumn.propertyPath;
                            replacements[propertyKey] = joinColumn.databaseName;
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_q && !_q.done && (_f = _p.return)) _f.call(_p);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_o && !_o.done && (_e = _m.return)) _e.call(_m);
                }
                finally { if (e_4) throw e_4.error; }
            }
            try {
                for (var _r = (e_6 = void 0, tslib_1.__values(alias.metadata.columns)), _s = _r.next(); !_s.done; _s = _r.next()) {
                    var column = _s.value;
                    replacements[column.databaseName] = column.databaseName;
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_s && !_s.done && (_g = _r.return)) _g.call(_r);
                }
                finally { if (e_6) throw e_6.error; }
            }
            try {
                for (var _t = (e_7 = void 0, tslib_1.__values(alias.metadata.columns)), _u = _t.next(); !_u.done; _u = _t.next()) {
                    var column = _u.value;
                    replacements[column.propertyName] = column.databaseName;
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_u && !_u.done && (_h = _t.return)) _h.call(_t);
                }
                finally { if (e_7) throw e_7.error; }
            }
            try {
                for (var _v = (e_8 = void 0, tslib_1.__values(alias.metadata.columns)), _w = _v.next(); !_w.done; _w = _v.next()) {
                    var column = _w.value;
                    replacements[column.propertyPath] = column.databaseName;
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_w && !_w.done && (_j = _v.return)) _j.call(_v);
                }
                finally { if (e_8) throw e_8.error; }
            }
            var replacementKeys = Object.keys(replacements);
            if (replacementKeys.length) {
                statement = statement.replace(new RegExp(
                // Avoid a lookbehind here since it's not well supported
                "([ =(]|^.{0})" +
                    (escapeRegExp(replaceAliasNamePrefix) + "(" + replacementKeys.map(escapeRegExp).join("|") + ")") +
                    "(?=[ =),]|.{0}$)", "gm"), function (_, pre, p) {
                    return "" + pre + replacementAliasNamePrefix + _this.escape(replacements[p]);
                });
            }
        };
        var this_1 = this;
        try {
            for (var _b = tslib_1.__values(this.expressionMap.aliases), _c = _b.next(); !_c.done; _c = _b.next()) {
                var alias = _c.value;
                _loop_1(alias);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return statement;
    };
    QueryBuilder.prototype.createComment = function () {
        if (!this.expressionMap.comment) {
            return "";
        }
        // ANSI SQL 2003 support C style comments - comments that start with `/*` and end with `*/`
        // In some dialects query nesting is available - but not all.  Because of this, we'll need
        // to scrub "ending" characters from the SQL but otherwise we can leave everything else
        // as-is and it should be valid.
        return "/* " + this.expressionMap.comment.replace("*/", "") + " */ ";
    };
    /**
     * Creates "WHERE" expression.
     */
    QueryBuilder.prototype.createWhereExpression = function () {
        var conditionsArray = [];
        var whereExpression = this.createWhereClausesExpression(this.expressionMap.wheres);
        if (whereExpression.length > 0 && whereExpression !== "1=1") {
            conditionsArray.push(this.replacePropertyNames(whereExpression));
        }
        if (this.expressionMap.mainAlias.hasMetadata) {
            var metadata = this.expressionMap.mainAlias.metadata;
            // Adds the global condition of "non-deleted" for the entity with delete date columns in select query.
            if (this.expressionMap.queryType === "select" && !this.expressionMap.withDeleted && metadata.deleteDateColumn) {
                var column = this.expressionMap.aliasNamePrefixingEnabled
                    ? this.expressionMap.mainAlias.name + "." + metadata.deleteDateColumn.propertyName
                    : metadata.deleteDateColumn.propertyName;
                var condition = this.replacePropertyNames(column) + " IS NULL";
                conditionsArray.push(condition);
            }
            if (metadata.discriminatorColumn && metadata.parentEntityMetadata) {
                var column = this.expressionMap.aliasNamePrefixingEnabled
                    ? this.expressionMap.mainAlias.name + "." + metadata.discriminatorColumn.databaseName
                    : metadata.discriminatorColumn.databaseName;
                var condition = this.replacePropertyNames(column) + " IN (:...discriminatorColumnValues)";
                conditionsArray.push(condition);
            }
        }
        if (this.expressionMap.extraAppendedAndWhereCondition) {
            var condition = this.replacePropertyNames(this.expressionMap.extraAppendedAndWhereCondition);
            conditionsArray.push(condition);
        }
        if (!conditionsArray.length) {
            return "";
        }
        else if (conditionsArray.length === 1) {
            return " WHERE " + conditionsArray[0];
        }
        else {
            return " WHERE ( " + conditionsArray.join(" ) AND ( ") + " )";
        }
    };
    /**
     * Creates "RETURNING" / "OUTPUT" expression.
     */
    QueryBuilder.prototype.createReturningExpression = function () {
        var _this = this;
        var columns = this.getReturningColumns();
        var driver = this.connection.driver;
        // also add columns we must auto-return to perform entity updation
        // if user gave his own returning
        if (typeof this.expressionMap.returning !== "string" &&
            this.expressionMap.extraReturningColumns.length > 0 &&
            driver.isReturningSqlSupported()) {
            columns.push.apply(columns, tslib_1.__spreadArray([], tslib_1.__read(this.expressionMap.extraReturningColumns.filter(function (column) {
                return columns.indexOf(column) === -1;
            }))));
        }
        if (columns.length) {
            var columnsExpression = columns.map(function (column) {
                var name = _this.escape(column.databaseName);
                if (driver instanceof SqlServerDriver_1.SqlServerDriver) {
                    if (_this.expressionMap.queryType === "insert" || _this.expressionMap.queryType === "update" || _this.expressionMap.queryType === "soft-delete" || _this.expressionMap.queryType === "restore") {
                        return "INSERTED." + name;
                    }
                    else {
                        return _this.escape(_this.getMainTableName()) + "." + name;
                    }
                }
                else {
                    return name;
                }
            }).join(", ");
            if (driver instanceof OracleDriver_1.OracleDriver) {
                columnsExpression += " INTO " + columns.map(function (column) {
                    return _this.createParameter({ type: driver.columnTypeToNativeParameter(column.type), dir: driver.oracle.BIND_OUT });
                }).join(", ");
            }
            if (driver instanceof SqlServerDriver_1.SqlServerDriver) {
                if (this.expressionMap.queryType === "insert" || this.expressionMap.queryType === "update") {
                    columnsExpression += " INTO @OutputTable";
                }
            }
            return columnsExpression;
        }
        else if (typeof this.expressionMap.returning === "string") {
            return this.expressionMap.returning;
        }
        return "";
    };
    /**
     * If returning / output cause is set to array of column names,
     * then this method will return all column metadatas of those column names.
     */
    QueryBuilder.prototype.getReturningColumns = function () {
        var _this = this;
        var columns = [];
        if (Array.isArray(this.expressionMap.returning)) {
            this.expressionMap.returning.forEach(function (columnName) {
                if (_this.expressionMap.mainAlias.hasMetadata) {
                    columns.push.apply(columns, tslib_1.__spreadArray([], tslib_1.__read(_this.expressionMap.mainAlias.metadata.findColumnsWithPropertyPath(columnName))));
                }
            });
        }
        return columns;
    };
    QueryBuilder.prototype.createWhereClausesExpression = function (clauses) {
        var _this = this;
        return clauses.map(function (clause, index) {
            var expression = _this.createWhereConditionExpression(clause.condition);
            switch (clause.type) {
                case "and":
                    return (index > 0 ? "AND " : "") + expression;
                case "or":
                    return (index > 0 ? "OR " : "") + expression;
            }
            return expression;
        }).join(" ").trim();
    };
    /**
     * Computes given where argument - transforms to a where string all forms it can take.
     */
    QueryBuilder.prototype.createWhereConditionExpression = function (condition, alwaysWrap) {
        if (alwaysWrap === void 0) { alwaysWrap = false; }
        if (typeof condition === "string")
            return condition;
        if (Array.isArray(condition)) {
            if (condition.length === 0) {
                return "1=1";
            }
            // In the future we should probably remove this entire condition
            // but for now to prevent any breaking changes it exists.
            if (condition.length === 1 && !alwaysWrap) {
                return this.createWhereClausesExpression(condition);
            }
            return "(" + this.createWhereClausesExpression(condition) + ")";
        }
        var driver = this.connection.driver;
        switch (condition.operator) {
            case "lessThan":
                return condition.parameters[0] + " < " + condition.parameters[1];
            case "lessThanOrEqual":
                return condition.parameters[0] + " <= " + condition.parameters[1];
            case "moreThan":
                return condition.parameters[0] + " > " + condition.parameters[1];
            case "moreThanOrEqual":
                return condition.parameters[0] + " >= " + condition.parameters[1];
            case "notEqual":
                return condition.parameters[0] + " != " + condition.parameters[1];
            case "equal":
                return condition.parameters[0] + " = " + condition.parameters[1];
            case "ilike":
                if (driver instanceof PostgresDriver_1.PostgresDriver || driver instanceof CockroachDriver_1.CockroachDriver) {
                    return condition.parameters[0] + " ILIKE " + condition.parameters[1];
                }
                return "UPPER(" + condition.parameters[0] + ") LIKE UPPER(" + condition.parameters[1] + ")";
            case "like":
                return condition.parameters[0] + " LIKE " + condition.parameters[1];
            case "between":
                return condition.parameters[0] + " BETWEEN " + condition.parameters[1] + " AND " + condition.parameters[2];
            case "in":
                if (condition.parameters.length <= 1) {
                    return "0=1";
                }
                return condition.parameters[0] + " IN (" + condition.parameters.slice(1).join(", ") + ")";
            case "any":
                return condition.parameters[0] + " = ANY(" + condition.parameters[1] + ")";
            case "isNull":
                return condition.parameters[0] + " IS NULL";
            case "not":
                return "NOT(" + this.createWhereConditionExpression(condition.condition) + ")";
            case "brackets":
                return "" + this.createWhereConditionExpression(condition.condition, true);
        }
        throw new TypeError("Unsupported FindOperator " + FindOperator_1.FindOperator.constructor.name);
    };
    /**
     * Creates "WHERE" condition for an in-ids condition.
     */
    QueryBuilder.prototype.getWhereInIdsCondition = function (ids) {
        var _a;
        var metadata = this.expressionMap.mainAlias.metadata;
        var normalized = (Array.isArray(ids) ? ids : [ids]).map(function (id) { return metadata.ensureEntityIdMap(id); });
        // using in(...ids) for single primary key entities
        if (!metadata.hasMultiplePrimaryKeys) {
            var primaryColumn_1 = metadata.primaryColumns[0];
            // getEntityValue will try to transform `In`, it is a bug
            // todo: remove this transformer check after #2390 is fixed
            // This also fails for embedded & relation, so until that is fixed skip it.
            if (!primaryColumn_1.transformer && !primaryColumn_1.relationMetadata && !primaryColumn_1.embeddedMetadata) {
                return _a = {},
                    _a[primaryColumn_1.propertyName] = In_1.In(normalized.map(function (id) { return primaryColumn_1.getEntityValue(id, false); })),
                    _a;
            }
        }
        return new Brackets_1.Brackets(function (qb) {
            var e_9, _a;
            var _loop_2 = function (data) {
                qb.orWhere(new Brackets_1.Brackets(function (qb) { return qb.where(data); }));
            };
            try {
                for (var normalized_1 = tslib_1.__values(normalized), normalized_1_1 = normalized_1.next(); !normalized_1_1.done; normalized_1_1 = normalized_1.next()) {
                    var data = normalized_1_1.value;
                    _loop_2(data);
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (normalized_1_1 && !normalized_1_1.done && (_a = normalized_1.return)) _a.call(normalized_1);
                }
                finally { if (e_9) throw e_9.error; }
            }
        });
    };
    QueryBuilder.prototype.findColumnsForPropertyPath = function (propertyPath) {
        // Make a helper to iterate the entity & relations?
        // Use that to set the correct alias?  Or the other way around?
        // Start with the main alias with our property paths
        var alias = this.expressionMap.mainAlias;
        var root = [];
        var propertyPathParts = propertyPath.split(".");
        var _loop_3 = function () {
            var part = propertyPathParts[0];
            if (!(alias === null || alias === void 0 ? void 0 : alias.hasMetadata)) {
                return "break";
            }
            if (alias.metadata.hasEmbeddedWithPropertyPath(part)) {
                // If this is an embedded then we should combine the two as part of our lookup.
                // Instead of just breaking, we keep going with this in case there's an embedded/relation
                // inside an embedded.
                propertyPathParts.unshift(propertyPathParts.shift() + "." + propertyPathParts.shift());
                return "continue";
            }
            if (alias.metadata.hasRelationWithPropertyPath(part)) {
                // If this is a relation then we should find the aliases
                // that match the relation & then continue further down
                // the property path
                var joinAttr = this_2.expressionMap.joinAttributes.find(function (joinAttr) { return joinAttr.relationPropertyPath === part; });
                if (!(joinAttr === null || joinAttr === void 0 ? void 0 : joinAttr.alias)) {
                    var fullRelationPath = root.length > 0 ? root.join(".") + "." + part : part;
                    throw new Error("Cannot find alias for relation at " + fullRelationPath);
                }
                alias = joinAttr.alias;
                root.push.apply(root, tslib_1.__spreadArray([], tslib_1.__read(part.split("."))));
                propertyPathParts.shift();
                return "continue";
            }
            return "break";
        };
        var this_2 = this;
        while (propertyPathParts.length > 1) {
            var state_1 = _loop_3();
            if (state_1 === "break")
                break;
        }
        if (!alias) {
            throw new Error("Cannot find alias for property " + propertyPath);
        }
        // Remaining parts are combined back and used to find the actual property path
        var aliasPropertyPath = propertyPathParts.join(".");
        var columns = alias.metadata.findColumnsWithPropertyPath(aliasPropertyPath);
        if (!columns.length) {
            throw new EntityColumnNotFound_1.EntityColumnNotFound(propertyPath);
        }
        return [alias, root, columns];
    };
    /**
     * Creates a property paths for a given ObjectLiteral.
     */
    QueryBuilder.prototype.createPropertyPath = function (metadata, entity, prefix) {
        var e_10, _a;
        if (prefix === void 0) { prefix = ""; }
        var paths = [];
        var _loop_4 = function (key) {
            var path = prefix ? prefix + "." + key : key;
            // There's times where we don't actually want to traverse deeper.
            // If the value is a `FindOperator`, or null, or not an object, then we don't, for example.
            if (entity[key] === null || typeof entity[key] !== "object" || entity[key] instanceof FindOperator_1.FindOperator) {
                paths.push(path);
                return "continue";
            }
            if (metadata.hasEmbeddedWithPropertyPath(path)) {
                var subPaths = this_3.createPropertyPath(metadata, entity[key], path);
                paths.push.apply(paths, tslib_1.__spreadArray([], tslib_1.__read(subPaths)));
                return "continue";
            }
            if (metadata.hasRelationWithPropertyPath(path)) {
                var relation = metadata.findRelationWithPropertyPath(path);
                // There's also cases where we don't want to return back all of the properties.
                // These handles the situation where someone passes the model & we don't need to make
                // a HUGE `where` to uniquely look up the entity.
                // In the case of a *-to-one, there's only ever one possible entity on the other side
                // so if the join columns are all defined we can return just the relation itself
                // because it will fetch only the join columns and do the lookup.
                if (relation.relationType === "one-to-one" || relation.relationType === "many-to-one") {
                    var joinColumns = relation.joinColumns
                        .map(function (j) { return j.referencedColumn; })
                        .filter(function (j) { return !!j; });
                    var hasAllJoinColumns = joinColumns.length > 0 && joinColumns.every(function (column) { return column.getEntityValue(entity[key], false); });
                    if (hasAllJoinColumns) {
                        paths.push(path);
                        return "continue";
                    }
                }
                if (relation.relationType === "one-to-many" || relation.relationType === "many-to-many") {
                    throw new Error("Cannot query across " + relation.relationType + " for property " + path);
                }
                // For any other case, if the `entity[key]` contains all of the primary keys we can do a
                // lookup via these.  We don't need to look up via any other values 'cause these are
                // the unique primary keys.
                // This handles the situation where someone passes the model & we don't need to make
                // a HUGE where.
                var primaryColumns = relation.inverseEntityMetadata.primaryColumns;
                var hasAllPrimaryKeys = primaryColumns.length > 0 && primaryColumns.every(function (column) { return column.getEntityValue(entity[key], false); });
                if (hasAllPrimaryKeys) {
                    var subPaths_1 = primaryColumns.map(function (column) { return path + "." + column.propertyPath; });
                    paths.push.apply(paths, tslib_1.__spreadArray([], tslib_1.__read(subPaths_1)));
                    return "continue";
                }
                // If nothing else, just return every property that's being passed to us.
                var subPaths = this_3.createPropertyPath(relation.inverseEntityMetadata, entity[key])
                    .map(function (p) { return path + "." + p; });
                paths.push.apply(paths, tslib_1.__spreadArray([], tslib_1.__read(subPaths)));
                return "continue";
            }
            paths.push(path);
        };
        var this_3 = this;
        try {
            for (var _b = tslib_1.__values(Object.keys(entity)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                _loop_4(key);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        return paths;
    };
    QueryBuilder.prototype.getPredicates = function (where) {
        var propertyPaths, propertyPaths_1, propertyPaths_1_1, propertyPath, _a, alias, aliasPropertyPath, columns, columns_1, columns_1_1, column, containedWhere, aliasPropertyPath_1, aliasPropertyPath_1_1, part, aliasPath, parameterValue, e_11_1, e_12_1, _b, _c, key, parameterValue, aliasPath, e_13_1;
        var e_12, _d, e_11, _e, e_14, _f, e_13, _g;
        return tslib_1.__generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!this.expressionMap.mainAlias.hasMetadata) return [3 /*break*/, 15];
                    propertyPaths = this.createPropertyPath(this.expressionMap.mainAlias.metadata, where);
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 12, 13, 14]);
                    propertyPaths_1 = tslib_1.__values(propertyPaths), propertyPaths_1_1 = propertyPaths_1.next();
                    _h.label = 2;
                case 2:
                    if (!!propertyPaths_1_1.done) return [3 /*break*/, 11];
                    propertyPath = propertyPaths_1_1.value;
                    _a = tslib_1.__read(this.findColumnsForPropertyPath(propertyPath), 3), alias = _a[0], aliasPropertyPath = _a[1], columns = _a[2];
                    _h.label = 3;
                case 3:
                    _h.trys.push([3, 8, 9, 10]);
                    columns_1 = (e_11 = void 0, tslib_1.__values(columns)), columns_1_1 = columns_1.next();
                    _h.label = 4;
                case 4:
                    if (!!columns_1_1.done) return [3 /*break*/, 7];
                    column = columns_1_1.value;
                    containedWhere = where;
                    try {
                        for (aliasPropertyPath_1 = (e_14 = void 0, tslib_1.__values(aliasPropertyPath)), aliasPropertyPath_1_1 = aliasPropertyPath_1.next(); !aliasPropertyPath_1_1.done; aliasPropertyPath_1_1 = aliasPropertyPath_1.next()) {
                            part = aliasPropertyPath_1_1.value;
                            if (!containedWhere || !(part in containedWhere)) {
                                containedWhere = {};
                                break;
                            }
                            containedWhere = containedWhere[part];
                        }
                    }
                    catch (e_14_1) { e_14 = { error: e_14_1 }; }
                    finally {
                        try {
                            if (aliasPropertyPath_1_1 && !aliasPropertyPath_1_1.done && (_f = aliasPropertyPath_1.return)) _f.call(aliasPropertyPath_1);
                        }
                        finally { if (e_14) throw e_14.error; }
                    }
                    aliasPath = this.expressionMap.aliasNamePrefixingEnabled ?
                        alias.name + "." + column.propertyPath :
                        column.propertyPath;
                    parameterValue = column.getEntityValue(containedWhere, true);
                    return [4 /*yield*/, [aliasPath, parameterValue]];
                case 5:
                    _h.sent();
                    _h.label = 6;
                case 6:
                    columns_1_1 = columns_1.next();
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_11_1 = _h.sent();
                    e_11 = { error: e_11_1 };
                    return [3 /*break*/, 10];
                case 9:
                    try {
                        if (columns_1_1 && !columns_1_1.done && (_e = columns_1.return)) _e.call(columns_1);
                    }
                    finally { if (e_11) throw e_11.error; }
                    return [7 /*endfinally*/];
                case 10:
                    propertyPaths_1_1 = propertyPaths_1.next();
                    return [3 /*break*/, 2];
                case 11: return [3 /*break*/, 14];
                case 12:
                    e_12_1 = _h.sent();
                    e_12 = { error: e_12_1 };
                    return [3 /*break*/, 14];
                case 13:
                    try {
                        if (propertyPaths_1_1 && !propertyPaths_1_1.done && (_d = propertyPaths_1.return)) _d.call(propertyPaths_1);
                    }
                    finally { if (e_12) throw e_12.error; }
                    return [7 /*endfinally*/];
                case 14: return [3 /*break*/, 22];
                case 15:
                    _h.trys.push([15, 20, 21, 22]);
                    _b = tslib_1.__values(Object.keys(where)), _c = _b.next();
                    _h.label = 16;
                case 16:
                    if (!!_c.done) return [3 /*break*/, 19];
                    key = _c.value;
                    parameterValue = where[key];
                    aliasPath = this.expressionMap.aliasNamePrefixingEnabled ? this.alias + "." + key : key;
                    return [4 /*yield*/, [aliasPath, parameterValue]];
                case 17:
                    _h.sent();
                    _h.label = 18;
                case 18:
                    _c = _b.next();
                    return [3 /*break*/, 16];
                case 19: return [3 /*break*/, 22];
                case 20:
                    e_13_1 = _h.sent();
                    e_13 = { error: e_13_1 };
                    return [3 /*break*/, 22];
                case 21:
                    try {
                        if (_c && !_c.done && (_g = _b.return)) _g.call(_b);
                    }
                    finally { if (e_13) throw e_13.error; }
                    return [7 /*endfinally*/];
                case 22: return [2 /*return*/];
            }
        });
    };
    QueryBuilder.prototype.getWherePredicateCondition = function (aliasPath, parameterValue) {
        var e_15, _a;
        if (parameterValue instanceof FindOperator_1.FindOperator) {
            var parameters = [];
            if (parameterValue.useParameter) {
                if (parameterValue.objectLiteralParameters) {
                    this.setParameters(parameterValue.objectLiteralParameters);
                }
                else if (parameterValue.multipleParameters) {
                    try {
                        for (var _b = tslib_1.__values(parameterValue.value), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var v = _c.value;
                            parameters.push(this.createParameter(v));
                        }
                    }
                    catch (e_15_1) { e_15 = { error: e_15_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_15) throw e_15.error; }
                    }
                }
                else {
                    parameters.push(this.createParameter(parameterValue.value));
                }
            }
            if (parameterValue.type === "raw") {
                if (parameterValue.getSql) {
                    return parameterValue.getSql(aliasPath);
                }
                else {
                    return {
                        operator: "equal",
                        parameters: [
                            aliasPath,
                            parameterValue.value,
                        ]
                    };
                }
            }
            else if (parameterValue.type === "not") {
                if (parameterValue.child) {
                    return {
                        operator: parameterValue.type,
                        condition: this.getWherePredicateCondition(aliasPath, parameterValue.child),
                    };
                }
                else {
                    return {
                        operator: "notEqual",
                        parameters: tslib_1.__spreadArray([
                            aliasPath
                        ], tslib_1.__read(parameters))
                    };
                }
            }
            else {
                return {
                    operator: parameterValue.type,
                    parameters: tslib_1.__spreadArray([
                        aliasPath
                    ], tslib_1.__read(parameters))
                };
            }
        }
        else if (parameterValue === null) {
            return {
                operator: "isNull",
                parameters: [
                    aliasPath,
                ]
            };
        }
        else {
            return {
                operator: "equal",
                parameters: [
                    aliasPath,
                    this.createParameter(parameterValue),
                ]
            };
        }
    };
    QueryBuilder.prototype.getWhereCondition = function (where) {
        var e_16, _a, e_17, _b;
        if (typeof where === "string") {
            return where;
        }
        if (where instanceof Brackets_1.Brackets) {
            var whereQueryBuilder = this.createQueryBuilder();
            whereQueryBuilder.parentQueryBuilder = this;
            whereQueryBuilder.expressionMap.mainAlias = this.expressionMap.mainAlias;
            whereQueryBuilder.expressionMap.aliasNamePrefixingEnabled = this.expressionMap.aliasNamePrefixingEnabled;
            whereQueryBuilder.expressionMap.parameters = this.expressionMap.parameters;
            whereQueryBuilder.expressionMap.nativeParameters = this.expressionMap.nativeParameters;
            whereQueryBuilder.expressionMap.wheres = [];
            where.whereFactory(whereQueryBuilder);
            return {
                operator: "brackets",
                condition: whereQueryBuilder.expressionMap.wheres
            };
        }
        if (where instanceof Function) {
            return where(this);
        }
        var wheres = Array.isArray(where) ? where : [where];
        var clauses = [];
        try {
            for (var wheres_1 = tslib_1.__values(wheres), wheres_1_1 = wheres_1.next(); !wheres_1_1.done; wheres_1_1 = wheres_1.next()) {
                var where_1 = wheres_1_1.value;
                var conditions = [];
                try {
                    // Filter the conditions and set up the parameter values
                    for (var _c = (e_17 = void 0, tslib_1.__values(this.getPredicates(where_1))), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var _e = tslib_1.__read(_d.value, 2), aliasPath = _e[0], parameterValue = _e[1];
                        conditions.push({
                            type: "and",
                            condition: this.getWherePredicateCondition(aliasPath, parameterValue),
                        });
                    }
                }
                catch (e_17_1) { e_17 = { error: e_17_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_17) throw e_17.error; }
                }
                clauses.push({ type: "or", condition: conditions });
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (wheres_1_1 && !wheres_1_1.done && (_a = wheres_1.return)) _a.call(wheres_1);
            }
            finally { if (e_16) throw e_16.error; }
        }
        if (clauses.length === 1) {
            return clauses[0].condition;
        }
        return clauses;
    };
    /**
     * Creates a query builder used to execute sql queries inside this query builder.
     */
    QueryBuilder.prototype.obtainQueryRunner = function () {
        return this.queryRunner || this.connection.createQueryRunner();
    };
    return QueryBuilder;
}());
exports.QueryBuilder = QueryBuilder;

//# sourceMappingURL=QueryBuilder.js.map
