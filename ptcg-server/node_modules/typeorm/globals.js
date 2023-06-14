"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueryBuilder = exports.getMongoRepository = exports.getCustomRepository = exports.getTreeRepository = exports.getRepository = exports.getSqljsManager = exports.getMongoManager = exports.getManager = exports.getConnection = exports.createConnections = exports.createConnection = exports.getConnectionManager = exports.getConnectionOptions = exports.getMetadataArgsStorage = void 0;
var tslib_1 = require("tslib");
var MetadataArgsStorage_1 = require("./metadata-args/MetadataArgsStorage");
var PlatformTools_1 = require("./platform/PlatformTools");
var ConnectionOptionsReader_1 = require("./connection/ConnectionOptionsReader");
var ConnectionManager_1 = require("./connection/ConnectionManager");
var container_1 = require("./container");
/**
 * Gets metadata args storage.
 */
function getMetadataArgsStorage() {
    // we should store metadata storage in a global variable otherwise it brings too much problems
    // one of the problem is that if any entity (or any other) will be imported before consumer will call
    // useContainer method with his own container implementation, that entity will be registered in the
    // old old container (default one post probably) and consumer will his entity.
    // calling useContainer before he imports any entity (or any other) is not always convenient.
    // another reason is that when we run migrations typeorm is being called from a global package
    // and it may load entities which register decorators in typeorm of local package
    // this leads to impossibility of usage of entities in migrations and cli related operations
    var globalScope = PlatformTools_1.PlatformTools.getGlobalVariable();
    if (!globalScope.typeormMetadataArgsStorage)
        globalScope.typeormMetadataArgsStorage = new MetadataArgsStorage_1.MetadataArgsStorage();
    return globalScope.typeormMetadataArgsStorage;
}
exports.getMetadataArgsStorage = getMetadataArgsStorage;
/**
 * Reads connection options stored in ormconfig configuration file.
 */
function getConnectionOptions(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new ConnectionOptionsReader_1.ConnectionOptionsReader().get(connectionName)];
        });
    });
}
exports.getConnectionOptions = getConnectionOptions;
/**
 * Gets a ConnectionManager which creates connections.
 */
function getConnectionManager() {
    return container_1.getFromContainer(ConnectionManager_1.ConnectionManager);
}
exports.getConnectionManager = getConnectionManager;
/**
 * Creates a new connection and registers it in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
function createConnection(optionsOrName) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var connectionName, options, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    connectionName = typeof optionsOrName === "string" ? optionsOrName : "default";
                    if (!(optionsOrName instanceof Object)) return [3 /*break*/, 1];
                    _a = optionsOrName;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, getConnectionOptions(connectionName)];
                case 2:
                    _a = _b.sent();
                    _b.label = 3;
                case 3:
                    options = _a;
                    return [2 /*return*/, getConnectionManager().create(options).connect()];
            }
        });
    });
}
exports.createConnection = createConnection;
/**
 * Creates new connections and registers them in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * All connections from the ormconfig will be created.
 */
function createConnections(options) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var connections;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!options) return [3 /*break*/, 2];
                    return [4 /*yield*/, new ConnectionOptionsReader_1.ConnectionOptionsReader().all()];
                case 1:
                    options = _a.sent();
                    _a.label = 2;
                case 2:
                    connections = options.map(function (options) { return getConnectionManager().create(options); });
                    return [2 /*return*/, Promise.all(connections.map(function (connection) { return connection.connect(); }))];
            }
        });
    });
}
exports.createConnections = createConnections;
/**
 * Gets connection from the connection manager.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
function getConnection(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName);
}
exports.getConnection = getConnection;
/**
 * Gets entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
function getManager(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).manager;
}
exports.getManager = getManager;
/**
 * Gets MongoDB entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
function getMongoManager(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).manager;
}
exports.getMongoManager = getMongoManager;
/**
 * Gets Sqljs entity manager from connection name.
 * "default" connection is used, when no name is specified.
 * Only works when Sqljs driver is used.
 */
function getSqljsManager(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).manager;
}
exports.getSqljsManager = getSqljsManager;
/**
 * Gets repository for the given entity class.
 */
function getRepository(entityClass, connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).getRepository(entityClass);
}
exports.getRepository = getRepository;
/**
 * Gets tree repository for the given entity class.
 */
function getTreeRepository(entityClass, connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).getTreeRepository(entityClass);
}
exports.getTreeRepository = getTreeRepository;
/**
 * Gets tree repository for the given entity class.
 */
function getCustomRepository(customRepository, connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).getCustomRepository(customRepository);
}
exports.getCustomRepository = getCustomRepository;
/**
 * Gets mongodb repository for the given entity class or name.
 */
function getMongoRepository(entityClass, connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).getMongoRepository(entityClass);
}
exports.getMongoRepository = getMongoRepository;
/**
 * Creates a new query builder.
 */
function createQueryBuilder(entityClass, alias, connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    if (entityClass) {
        return getRepository(entityClass, connectionName).createQueryBuilder(alias);
    }
    return getConnection(connectionName).createQueryBuilder();
}
exports.createQueryBuilder = createQueryBuilder;

//# sourceMappingURL=globals.js.map
