"use strict";
exports.__esModule = true;
exports.Marker = void 0;
var Marker = /** @class */ (function () {
    function Marker() {
        this.markers = [];
    }
    Marker.prototype.hasMarker = function (name, source) {
        if (source === undefined) {
            return this.markers.some(function (c) { return c.name === name; });
        }
        return this.markers.some(function (c) { return c.source === source && c.name === name; });
    };
    Marker.prototype.removeMarker = function (name, source) {
        if (!this.hasMarker(name, source)) {
            return;
        }
        if (source === undefined) {
            this.markers = this.markers.filter(function (c) { return c.name !== name; });
            return;
        }
        this.markers = this.markers.filter(function (c) { return c.source !== source || c.name !== name; });
    };
    Marker.prototype.addMarker = function (name, source) {
        if (this.hasMarker(name, source)) {
            return;
        }
        this.markers.push({ name: name, source: source });
    };
    Marker.prototype.addMarkerToState = function (name) {
        if (this.hasMarker(name)) {
            return;
        }
        this.markers.push({ name: name });
    };
    return Marker;
}());
exports.Marker = Marker;
