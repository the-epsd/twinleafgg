"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SableyeArt = exports.PokeDrawerArt = exports.PokeBlowerArt = exports.LuxuryBallArt = void 0;
const luxury_ball_1 = require("./luxury-ball");
const poke_blower_1 = require("./poke-blower");
const poke_drawer_1 = require("./poke-drawer");
const sableye_1 = require("./sableye");
class LuxuryBallArt extends luxury_ball_1.LuxuryBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/dp7/86_hires.png';
    }
}
exports.LuxuryBallArt = LuxuryBallArt;
class PokeBlowerArt extends poke_blower_1.PokeBlower {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/dp7/88_hires.png';
    }
}
exports.PokeBlowerArt = PokeBlowerArt;
class PokeDrawerArt extends poke_drawer_1.PokeDrawer {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/dp7/89_hires.png';
    }
}
exports.PokeDrawerArt = PokeDrawerArt;
class SableyeArt extends sableye_1.Sableye {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://images.pokemontcg.io/dp7/48_hires.png';
    }
}
exports.SableyeArt = SableyeArt;
