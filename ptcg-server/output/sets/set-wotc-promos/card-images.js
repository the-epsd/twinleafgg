"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewtwoArt = exports.MewArt = void 0;
const mew_1 = require("./mew");
const mewtwo_1 = require("./mewtwo");
class MewArt extends mew_1.Mew {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/mew-wizards-black-star-promos-8.jpg?fit=600%2C825&ssl=1';
    }
}
exports.MewArt = MewArt;
class MewtwoArt extends mewtwo_1.Mewtwo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/mewtwo-wizards-black-star-promos-3.jpg?fit=600%2C825&ssl=1';
    }
}
exports.MewtwoArt = MewtwoArt;
