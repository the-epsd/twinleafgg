"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableInheritance = void 0;
var globals_1 = require("../../globals");
/**
 * Sets for entity to use table inheritance pattern.
 */
function TableInheritance(options) {
    return function (target) {
        globals_1.getMetadataArgsStorage().inheritances.push({
            target: target,
            pattern: options && options.pattern ? options.pattern : "STI",
            column: options && options.column ? typeof options.column === "string" ? { name: options.column } : options.column : undefined
        });
    };
}
exports.TableInheritance = TableInheritance;

//# sourceMappingURL=TableInheritance.js.map
