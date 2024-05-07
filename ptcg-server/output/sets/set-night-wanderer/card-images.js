"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeutralCenterArt = exports.KyuremArt = void 0;
const kyurem_1 = require("./kyurem");
const neutral_center_1 = require("./neutral-center");
class KyuremArt extends kyurem_1.Kyurem {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pbs.twimg.com/media/GMtwxRDaEAAgqV6?format=jpg&name=900x900';
    }
}
exports.KyuremArt = KyuremArt;
class NeutralCenterArt extends neutral_center_1.NeutralCenter {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pbs.twimg.com/media/GMtxbEmbAAA6xKB?format=jpg&name=900x900';
    }
}
exports.NeutralCenterArt = NeutralCenterArt;
