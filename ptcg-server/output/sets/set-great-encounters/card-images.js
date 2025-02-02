"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatzelArt = exports.BuizelArt = void 0;
const buizel_1 = require("./buizel");
const floatzel_1 = require("./floatzel");
class BuizelArt extends buizel_1.Buizel {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/dp4/61_hires.png';
    }
}
exports.BuizelArt = BuizelArt;
class FloatzelArt extends floatzel_1.Floatzel {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/dp4/37_hires.png';
    }
}
exports.FloatzelArt = FloatzelArt;
