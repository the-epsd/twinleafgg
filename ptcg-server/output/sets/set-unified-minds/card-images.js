"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTurnBoardArt = exports.PurrloinArt = exports.NecrozmaArt = void 0;
const necrozma_1 = require("./necrozma");
const purrloin_1 = require("./purrloin");
const u_turn_board_1 = require("./u-turn-board");
class NecrozmaArt extends necrozma_1.Necrozma {
    constructor() {
        super(...arguments);
        this.cardimage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UNM/UNM_101_R_EN_LG.png';
    }
}
exports.NecrozmaArt = NecrozmaArt;
class PurrloinArt extends purrloin_1.Purrloin {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UNM/UNM_135_R_EN_LG.png';
    }
}
exports.PurrloinArt = PurrloinArt;
class UTurnBoardArt extends u_turn_board_1.UTurnBoard {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UNM/UNM_211_R_EN_LG.png';
    }
}
exports.UTurnBoardArt = UTurnBoardArt;
