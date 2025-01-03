"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGenerations = void 0;
const charmeleon_1 = require("./charmeleon");
const max_revive_1 = require("./max-revive");
const red_card_1 = require("./red-card");
const revitalizer_1 = require("./revitalizer");
const team_flare_grunt_1 = require("./team-flare-grunt");
exports.setGenerations = [
    new max_revive_1.MaxRevive(),
    new red_card_1.RedCard(),
    new revitalizer_1.Revitalizer(),
    new team_flare_grunt_1.TeamFlareGrunt(),
    // FA/Radiant Collection
    new charmeleon_1.Charmeleon(),
];
