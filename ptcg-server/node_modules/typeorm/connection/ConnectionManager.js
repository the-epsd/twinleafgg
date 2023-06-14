"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionManager = void 0;
var Connection_1 = require("./Connection");
var ConnectionNotFoundError_1 = require("../error/ConnectionNotFoundError");
var AlreadyHasActiveConnectionError_1 = require("../error/AlreadyHasActiveConnectionError");
/**
 * ConnectionManager is used to store and manage multiple orm connections.
 * It also provides useful factory methods to simplify connection creation.
 */
var ConnectionManager = /** @class */ (function () {
    function ConnectionManager() {
        /**
         * Internal lookup to quickly get from a connection name to the Connection object.
         */
        this.connectionMap = new Map();
    }
    Object.defineProperty(ConnectionManager.prototype, "connections", {
        /**
         * List of connections registered in this connection manager.
         */
        get: function () {
            return Array.from(this.connectionMap.values());
        },
        enumerable: false,
        configurable: true
    });
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Checks if connection with the given name exist in the manager.
     */
    ConnectionManager.prototype.has = function (name) {
        return this.connectionMap.has(name);
    };
    /**
     * Gets registered connection with the given name.
     * If connection name is not given then it will get a default connection.
     * Throws error if connection with the given name was not found.
     */
    ConnectionManager.prototype.get = function (name) {
        if (name === void 0) { name = "default"; }
        var connection = this.connectionMap.get(name);
        if (!connection)
            throw new ConnectionNotFoundError_1.ConnectionNotFoundError(name);
        return connection;
    };
    /**
     * Creates a new connection based on the given connection options and registers it in the manager.
     * Connection won't be established, you'll need to manually call connect method to establish connection.
     */
    ConnectionManager.prototype.create = function (options) {
        // check if such connection is already registered
        var existConnection = this.connectionMap.get(options.name || "default");
        if (existConnection) {
            // if connection is registered and its not closed then throw an error
            if (existConnection.isConnected)
                throw new AlreadyHasActiveConnectionError_1.AlreadyHasActiveConnectionError(options.name || "default");
        }
        // create a new connection
        var connection = new Connection_1.Connection(options);
        this.connectionMap.set(connection.name, connection);
        return connection;
    };
    return ConnectionManager;
}());
exports.ConnectionManager = ConnectionManager;

//# sourceMappingURL=ConnectionManager.js.map
