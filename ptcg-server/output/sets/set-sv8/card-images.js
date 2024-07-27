"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeraOrbArt = exports.MarillArt = exports.CherishCarrierArt = exports.PerfectMixerArt = exports.AzumarillArt = exports.HoOhArt = void 0;
const azulmarill_1 = require("./azulmarill");
const cherish_carrier_1 = require("./cherish-carrier");
const ho_oh_1 = require("./ho-oh");
const marill_1 = require("./marill");
const perfect_mixer_1 = require("./perfect-mixer");
const tera_orb_1 = require("./tera-orb");
class HoOhArt extends ho_oh_1.HoOh {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pbs.twimg.com/media/GTY5hwSXMAIqBkf?format=jpg&name=large';
    }
}
exports.HoOhArt = HoOhArt;
class AzumarillArt extends azulmarill_1.Azumarill {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pbs.twimg.com/media/GTY4mvvWMAAxw7P?format=jpg&name=large';
    }
}
exports.AzumarillArt = AzumarillArt;
class PerfectMixerArt extends perfect_mixer_1.PerfectMixer {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pbs.twimg.com/media/GTY4JHhXoAAMtNV?format=jpg&name=large';
    }
}
exports.PerfectMixerArt = PerfectMixerArt;
class CherishCarrierArt extends cherish_carrier_1.CherishCarrier {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pbs.twimg.com/media/GTY3QxxXkAAqzhh?format=jpg&name=large';
    }
}
exports.CherishCarrierArt = CherishCarrierArt;
class MarillArt extends marill_1.Marill {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pbs.twimg.com/media/GTZFCqaWIAAecHF?format=jpg&name=large';
    }
}
exports.MarillArt = MarillArt;
class TeraOrbArt extends tera_orb_1.TeraOrb {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pbs.twimg.com/media/GTY3wkfWAAAmv5O?format=jpg&name=large';
    }
}
exports.TeraOrbArt = TeraOrbArt;
