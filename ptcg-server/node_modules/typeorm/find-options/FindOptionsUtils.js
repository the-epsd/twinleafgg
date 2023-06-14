"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindOptionsUtils = void 0;
var tslib_1 = require("tslib");
var FindRelationsNotFoundError_1 = require("../error/FindRelationsNotFoundError");
var DriverUtils_1 = require("../driver/DriverUtils");
var error_1 = require("../error");
/**
 * Utilities to work with FindOptions.
 */
var FindOptionsUtils = /** @class */ (function () {
    function FindOptionsUtils() {
    }
    // -------------------------------------------------------------------------
    // Public Static Methods
    // -------------------------------------------------------------------------
    /**
     * Checks if given object is really instance of FindOneOptions interface.
     */
    FindOptionsUtils.isFindOneOptions = function (obj) {
        var possibleOptions = obj;
        return possibleOptions &&
            (Array.isArray(possibleOptions.select) ||
                possibleOptions.where instanceof Object ||
                typeof possibleOptions.where === "string" ||
                Array.isArray(possibleOptions.relations) ||
                possibleOptions.join instanceof Object ||
                possibleOptions.order instanceof Object ||
                possibleOptions.cache instanceof Object ||
                typeof possibleOptions.cache === "boolean" ||
                typeof possibleOptions.cache === "number" ||
                possibleOptions.lock instanceof Object ||
                possibleOptions.loadRelationIds instanceof Object ||
                typeof possibleOptions.loadRelationIds === "boolean" ||
                typeof possibleOptions.loadEagerRelations === "boolean" ||
                typeof possibleOptions.withDeleted === "boolean" ||
                typeof possibleOptions.transaction === "boolean");
    };
    /**
     * Checks if given object is really instance of FindManyOptions interface.
     */
    FindOptionsUtils.isFindManyOptions = function (obj) {
        var possibleOptions = obj;
        return possibleOptions && (this.isFindOneOptions(possibleOptions) ||
            typeof possibleOptions.skip === "number" ||
            typeof possibleOptions.take === "number" ||
            typeof possibleOptions.skip === "string" ||
            typeof possibleOptions.take === "string");
    };
    /**
     * Checks if given object is really instance of FindOptions interface.
     */
    FindOptionsUtils.extractFindManyOptionsAlias = function (object) {
        if (this.isFindManyOptions(object) && object.join)
            return object.join.alias;
        return undefined;
    };
    /**
     * Applies give find many options to the given query builder.
     */
    FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder = function (qb, options) {
        if (this.isFindManyOptions(options))
            return this.applyOptionsToQueryBuilder(qb, options);
        if (options)
            return qb.where(options);
        return qb;
    };
    /**
     * Applies give find options to the given query builder.
     */
    FindOptionsUtils.applyOptionsToQueryBuilder = function (qb, options) {
        // if options are not set then simply return query builder. This is made for simplicity of usage.
        if (!options || (!this.isFindOneOptions(options) && !this.isFindManyOptions(options)))
            return qb;
        if (options.transaction === true) {
            qb.expressionMap.useTransaction = true;
        }
        if (!qb.expressionMap.mainAlias || !qb.expressionMap.mainAlias.hasMetadata)
            return qb;
        var metadata = qb.expressionMap.mainAlias.metadata;
        // apply all options from FindOptions
        if (options.withDeleted) {
            qb.withDeleted();
        }
        if (options.select) {
            qb.select([]);
            options.select.forEach(function (select) {
                var e_1, _a;
                if (!metadata.hasColumnWithPropertyPath("" + select))
                    throw new error_1.TypeORMError(select + " column was not found in the " + metadata.name + " entity.");
                var columns = metadata.findColumnsWithPropertyPath("" + select);
                try {
                    for (var columns_1 = tslib_1.__values(columns), columns_1_1 = columns_1.next(); !columns_1_1.done; columns_1_1 = columns_1.next()) {
                        var column = columns_1_1.value;
                        qb.addSelect(qb.alias + "." + column.propertyPath);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (columns_1_1 && !columns_1_1.done && (_a = columns_1.return)) _a.call(columns_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
        }
        if (options.relations) {
            // Copy because `applyRelationsRecursively` modifies it
            var allRelations = tslib_1.__spreadArray([], tslib_1.__read(options.relations));
            this.applyRelationsRecursively(qb, allRelations, qb.expressionMap.mainAlias.name, qb.expressionMap.mainAlias.metadata, "");
            // recursive removes found relations from allRelations array
            // if there are relations left in this array it means those relations were not found in the entity structure
            // so, we give an exception about not found relations
            if (allRelations.length > 0)
                throw new FindRelationsNotFoundError_1.FindRelationsNotFoundError(allRelations);
        }
        if (options.join) {
            if (options.join.leftJoin)
                Object.keys(options.join.leftJoin).forEach(function (key) {
                    qb.leftJoin(options.join.leftJoin[key], key);
                });
            if (options.join.innerJoin)
                Object.keys(options.join.innerJoin).forEach(function (key) {
                    qb.innerJoin(options.join.innerJoin[key], key);
                });
            if (options.join.leftJoinAndSelect)
                Object.keys(options.join.leftJoinAndSelect).forEach(function (key) {
                    qb.leftJoinAndSelect(options.join.leftJoinAndSelect[key], key);
                });
            if (options.join.innerJoinAndSelect)
                Object.keys(options.join.innerJoinAndSelect).forEach(function (key) {
                    qb.innerJoinAndSelect(options.join.innerJoinAndSelect[key], key);
                });
        }
        if (options.cache) {
            if (options.cache instanceof Object) {
                var cache = options.cache;
                qb.cache(cache.id, cache.milliseconds);
            }
            else {
                qb.cache(options.cache);
            }
        }
        if (options.lock) {
            if (options.lock.mode === "optimistic") {
                qb.setLock(options.lock.mode, options.lock.version);
            }
            else if (options.lock.mode === "pessimistic_read" || options.lock.mode === "pessimistic_write" || options.lock.mode === "dirty_read" || options.lock.mode === "pessimistic_partial_write" || options.lock.mode === "pessimistic_write_or_fail") {
                var tableNames = options.lock.tables ? options.lock.tables.map(function (table) {
                    var tableAlias = qb.expressionMap.aliases.find(function (alias) {
                        return alias.metadata.tableNameWithoutPrefix === table;
                    });
                    if (!tableAlias) {
                        throw new error_1.TypeORMError("\"" + table + "\" is not part of this query");
                    }
                    return qb.escape(tableAlias.name);
                }) : undefined;
                qb.setLock(options.lock.mode, undefined, tableNames);
            }
        }
        if (options.loadRelationIds === true) {
            qb.loadAllRelationIds();
        }
        else if (options.loadRelationIds instanceof Object) {
            qb.loadAllRelationIds(options.loadRelationIds);
        }
        if (options.where)
            qb.where(options.where);
        if (options.skip)
            qb.skip(options.skip);
        if (options.take)
            qb.take(options.take);
        if (options.order)
            Object.keys(options.order).forEach(function (key) {
                var order = options.order[key];
                if (!metadata.findColumnWithPropertyPath(key))
                    throw new Error(key + " column was not found in the " + metadata.name + " entity.");
                switch (order) {
                    case 1:
                        qb.addOrderBy(qb.alias + "." + key, "ASC");
                        break;
                    case -1:
                        qb.addOrderBy(qb.alias + "." + key, "DESC");
                        break;
                    case "ASC":
                        qb.addOrderBy(qb.alias + "." + key, "ASC");
                        break;
                    case "DESC":
                        qb.addOrderBy(qb.alias + "." + key, "DESC");
                        break;
                }
            });
        return qb;
    };
    // -------------------------------------------------------------------------
    // Protected Static Methods
    // -------------------------------------------------------------------------
    /**
     * Adds joins for all relations and sub-relations of the given relations provided in the find options.
     */
    FindOptionsUtils.applyRelationsRecursively = function (qb, allRelations, alias, metadata, prefix) {
        var _this = this;
        // find all relations that match given prefix
        var matchedBaseRelations = [];
        if (prefix) {
            var regexp_1 = new RegExp("^" + prefix.replace(".", "\\.") + "\\.");
            matchedBaseRelations = allRelations
                .filter(function (relation) { return relation.match(regexp_1); })
                .map(function (relation) { return relation.replace(regexp_1, ""); })
                .filter(function (relation) { return metadata.findRelationWithPropertyPath(relation); });
        }
        else {
            matchedBaseRelations = allRelations.filter(function (relation) { return metadata.findRelationWithPropertyPath(relation); });
        }
        // go through all matched relations and add join for them
        matchedBaseRelations.forEach(function (relation) {
            // generate a relation alias
            var relationAlias = DriverUtils_1.DriverUtils.buildAlias(qb.connection.driver, { shorten: true, joiner: "__" }, alias, relation);
            // add a join for the found relation
            var selection = alias + "." + relation;
            qb.leftJoinAndSelect(selection, relationAlias);
            // remove added relations from the allRelations array, this is needed to find all not found relations at the end
            allRelations.splice(allRelations.indexOf(prefix ? prefix + "." + relation : relation), 1);
            // try to find sub-relations
            var join = qb.expressionMap.joinAttributes.find(function (join) { return join.entityOrProperty === selection; });
            _this.applyRelationsRecursively(qb, allRelations, join.alias.name, join.metadata, prefix ? prefix + "." + relation : relation);
            // join the eager relations of the found relation
            var relMetadata = metadata.relations.find(function (metadata) { return metadata.propertyName === relation; });
            if (relMetadata) {
                _this.joinEagerRelations(qb, relationAlias, relMetadata.inverseEntityMetadata);
            }
        });
    };
    FindOptionsUtils.joinEagerRelations = function (qb, alias, metadata) {
        var _this = this;
        metadata.eagerRelations.forEach(function (relation) {
            var e_2, _a, e_3, _b;
            // generate a relation alias
            var relationAlias = DriverUtils_1.DriverUtils.buildAlias(qb.connection.driver, { shorten: true }, qb.connection.namingStrategy.eagerJoinRelationAlias(alias, relation.propertyPath));
            // add a join for the relation
            // Checking whether the relation wasn't joined yet.
            var addJoin = true;
            try {
                for (var _c = tslib_1.__values(qb.expressionMap.joinAttributes), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var join = _d.value;
                    if (join.condition !== undefined ||
                        join.mapToProperty !== undefined ||
                        join.isMappingMany !== undefined ||
                        join.direction !== "LEFT" ||
                        join.entityOrProperty !== alias + "." + relation.propertyPath) {
                        continue;
                    }
                    addJoin = false;
                    relationAlias = join.alias.name;
                    break;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (addJoin) {
                qb.leftJoin(alias + "." + relation.propertyPath, relationAlias);
            }
            // Checking whether the relation wasn't selected yet.
            // This check shall be after the join check to detect relationAlias.
            var addSelect = true;
            try {
                for (var _e = tslib_1.__values(qb.expressionMap.selects), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var select = _f.value;
                    if (select.aliasName !== undefined || select.virtual !== undefined || select.selection !== relationAlias) {
                        continue;
                    }
                    addSelect = false;
                    break;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_3) throw e_3.error; }
            }
            if (addSelect) {
                qb.addSelect(relationAlias);
            }
            // (recursive) join the eager relations
            _this.joinEagerRelations(qb, relationAlias, relation.inverseEntityMetadata);
        });
    };
    return FindOptionsUtils;
}());
exports.FindOptionsUtils = FindOptionsUtils;

//# sourceMappingURL=FindOptionsUtils.js.map
