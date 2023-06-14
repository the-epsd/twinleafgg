"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
/**
 * View in the database represented in this class.
 */
var View = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function View(options) {
        if (options) {
            this.database = options.database;
            this.schema = options.schema;
            this.name = options.name;
            this.expression = options.expression;
            this.materialized = !!options.materialized;
        }
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Clones this table to a new table with all properties cloned.
     */
    View.prototype.clone = function () {
        return new View({
            database: this.database,
            schema: this.schema,
            name: this.name,
            expression: this.expression,
            materialized: this.materialized,
        });
    };
    // -------------------------------------------------------------------------
    // Static Methods
    // -------------------------------------------------------------------------
    /**
     * Creates view from a given entity metadata.
     */
    View.create = function (entityMetadata, driver) {
        var options = {
            database: entityMetadata.database,
            schema: entityMetadata.schema,
            name: driver.buildTableName(entityMetadata.tableName, entityMetadata.schema, entityMetadata.database),
            expression: entityMetadata.expression,
            materialized: entityMetadata.tableMetadataArgs.materialized
        };
        return new View(options);
    };
    return View;
}());
exports.View = View;

//# sourceMappingURL=View.js.map
