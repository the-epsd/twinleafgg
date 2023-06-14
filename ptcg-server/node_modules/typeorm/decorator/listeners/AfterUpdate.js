"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterUpdate = void 0;
var globals_1 = require("../../globals");
var EventListenerTypes_1 = require("../../metadata/types/EventListenerTypes");
/**
 * Calls a method on which this decorator is applied after this entity update.
 */
function AfterUpdate() {
    return function (object, propertyName) {
        globals_1.getMetadataArgsStorage().entityListeners.push({
            target: object.constructor,
            propertyName: propertyName,
            type: EventListenerTypes_1.EventListenerTypes.AFTER_UPDATE
        });
    };
}
exports.AfterUpdate = AfterUpdate;

//# sourceMappingURL=AfterUpdate.js.map
