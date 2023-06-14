"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterRemove = void 0;
var globals_1 = require("../../globals");
var EventListenerTypes_1 = require("../../metadata/types/EventListenerTypes");
/**
 * Calls a method on which this decorator is applied after this entity removal.
 */
function AfterRemove() {
    return function (object, propertyName) {
        globals_1.getMetadataArgsStorage().entityListeners.push({
            target: object.constructor,
            propertyName: propertyName,
            type: EventListenerTypes_1.EventListenerTypes.AFTER_REMOVE
        });
    };
}
exports.AfterRemove = AfterRemove;

//# sourceMappingURL=AfterRemove.js.map
