import { __awaiter, __generator } from "tslib";
import { MetadataArgsStorage } from "./metadata-args/MetadataArgsStorage";
import { PlatformTools } from "./platform/PlatformTools";
import { ConnectionOptionsReader } from "./connection/ConnectionOptionsReader";
import { ConnectionManager } from "./connection/ConnectionManager";
import { getFromContainer } from "./container";
/**
 * Gets metadata args storage.
 */
export function getMetadataArgsStorage() {
    // we should store metadata storage in a global variable otherwise it brings too much problems
    // one of the problem is that if any entity (or any other) will be imported before consumer will call
    // useContainer method with his own container implementation, that entity will be registered in the
    // old old container (default one post probably) and consumer will his entity.
    // calling useContainer before he imports any entity (or any other) is not always convenient.
    // another reason is that when we run migrations typeorm is being called from a global package
    // and it may load entities which register decorators in typeorm of local package
    // this leads to impossibility of usage of entities in migrations and cli related operations
    var globalScope = PlatformTools.getGlobalVariable();
    if (!globalScope.typeormMetadataArgsStorage)
        globalScope.typeormMetadataArgsStorage = new MetadataArgsStorage();
    return globalScope.typeormMetadataArgsStorage;
}
/**
 * Reads connection options stored in ormconfig configuration file.
 */
export function getConnectionOptions(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new ConnectionOptionsReader().get(connectionName)];
        });
    });
}
/**
 * Gets a ConnectionManager which creates connections.
 */
export function getConnectionManager() {
    return getFromContainer(ConnectionManager);
}
/**
 * Creates a new connection and registers it in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export function createConnection(optionsOrName) {
    return __awaiter(this, void 0, void 0, function () {
        var connectionName, options, _a;
        return __generator(this, function (_b) {
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
/**
 * Creates new connections and registers them in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * All connections from the ormconfig will be created.
 */
export function createConnections(options) {
    return __awaiter(this, void 0, void 0, function () {
        var connections;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!options) return [3 /*break*/, 2];
                    return [4 /*yield*/, new ConnectionOptionsReader().all()];
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
/**
 * Gets connection from the connection manager.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export function getConnection(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName);
}
/**
 * Gets entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export function getManager(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).manager;
}
/**
 * Gets MongoDB entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export function getMongoManager(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).manager;
}
/**
 * Gets Sqljs entity manager from connection name.
 * "default" connection is used, when no name is specified.
 * Only works when Sqljs driver is used.
 */
export function getSqljsManager(connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).manager;
}
/**
 * Gets repository for the given entity class.
 */
export function getRepository(entityClass, connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).getRepository(entityClass);
}
/**
 * Gets tree repository for the given entity class.
 */
export function getTreeRepository(entityClass, connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).getTreeRepository(entityClass);
}
/**
 * Gets tree repository for the given entity class.
 */
export function getCustomRepository(customRepository, connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).getCustomRepository(customRepository);
}
/**
 * Gets mongodb repository for the given entity class or name.
 */
export function getMongoRepository(entityClass, connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    return getConnectionManager().get(connectionName).getMongoRepository(entityClass);
}
/**
 * Creates a new query builder.
 */
export function createQueryBuilder(entityClass, alias, connectionName) {
    if (connectionName === void 0) { connectionName = "default"; }
    if (entityClass) {
        return getRepository(entityClass, connectionName).createQueryBuilder(alias);
    }
    return getConnection(connectionName).createQueryBuilder();
}

//# sourceMappingURL=globals.js.map
