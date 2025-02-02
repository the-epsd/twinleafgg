export class Marker {
    constructor() {
        this.markers = [];
    }
    hasMarker(name, source) {
        if (source === undefined) {
            return this.markers.some(c => c.name === name);
        }
        return this.markers.some(c => c.source === source && c.name === name);
    }
    removeMarker(name, source) {
        if (!this.hasMarker(name, source)) {
            return;
        }
        if (source === undefined) {
            this.markers = this.markers.filter(c => c.name !== name);
            return;
        }
        this.markers = this.markers.filter(c => c.source !== source || c.name !== name);
    }
    addMarker(name, source) {
        if (this.hasMarker(name, source)) {
            return;
        }
        this.markers.push({ name, source });
    }
    addMarkerToState(name) {
        if (this.hasMarker(name)) {
            return;
        }
        this.markers.push({ name });
    }
}
