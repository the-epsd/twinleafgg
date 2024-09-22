"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CyranoArt = exports.MiraculousIntercomArt = exports.ExcitingStadiumArt = exports.GravityMountainArt = exports.MagnetonArt = exports.MagnemiteArt = exports.TerapagosArt = exports.PikachuexArt = void 0;
const magneton_1 = require("../set-scarlet-and-violet-promos/magneton");
const cyrano_1 = require("./cyrano");
const exciting_stadium_1 = require("./exciting-stadium");
const gravity_mountain_1 = require("./gravity-mountain");
const magnemite_1 = require("./magnemite");
const miraculous_intercom_1 = require("./miraculous-intercom");
const pikachu_ex_1 = require("./pikachu-ex");
const terapagos_1 = require("./terapagos");
class PikachuexArt extends pikachu_ex_1.Pikachuex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pokemonproxies.com/static/media/8i-033-Pikachu_ex.59c3ad488393197a4f14.png';
    }
}
exports.PikachuexArt = PikachuexArt;
class TerapagosArt extends terapagos_1.Terapagos {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pokemonproxies.com/static/media/8i-093-Terapagos.fbc2a55ff31d62c15914.png';
    }
}
exports.TerapagosArt = TerapagosArt;
class MagnemiteArt extends magnemite_1.Magnemite {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pokemonproxies.com/static/media/8i-034-Magnemite.43bcb4c967f83f8ca1a3.png';
    }
}
exports.MagnemiteArt = MagnemiteArt;
class MagnetonArt extends magneton_1.Magneton {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pokemonproxies.com/static/media/8i-035-Magneton.14142fde61a9aa63fd24.png';
        this.set = 'SV8';
        this.fullName = 'Magneton SV8';
        this.setNumber = '35';
    }
}
exports.MagnetonArt = MagnetonArt;
class GravityMountainArt extends gravity_mountain_1.GravityMountain {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pokemonproxies.com/static/media/8i-106-Gravity_Mountain.764ab940ffe5c9af71a8.png';
    }
}
exports.GravityMountainArt = GravityMountainArt;
class ExcitingStadiumArt extends exciting_stadium_1.ExcitingStadium {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pokemonproxies.com/static/media/8i-105-Exciting_Stadium.c98c5a6a761ea270c5d4.png';
    }
}
exports.ExcitingStadiumArt = ExcitingStadiumArt;
class MiraculousIntercomArt extends miraculous_intercom_1.MiraculousIntercom {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pokemonproxies.com/static/media/8i-097-Miraculous_Intercom.55d2409f22d0d359f25a.png';
    }
}
exports.MiraculousIntercomArt = MiraculousIntercomArt;
class CyranoArt extends cyrano_1.Cyrano {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pokemonproxies.com/static/media/8i-102-Cyrano.027d5eba075c868bcc20.png';
    }
}
exports.CyranoArt = CyranoArt;
