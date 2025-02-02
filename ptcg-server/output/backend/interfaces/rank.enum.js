"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankLevels = exports.Rank = void 0;
var Rank;
(function (Rank) {
    Rank["JUNIOR"] = "JUNIOR";
    Rank["SENIOR"] = "SENIOR";
    Rank["ULTRA"] = "ULTRA";
    Rank["MASTER"] = "MASTER";
    Rank["ADMIN"] = "ADMIN";
    Rank["BANNED"] = "BANNED";
    Rank["POKE"] = "POKE";
    Rank["GREAT"] = "GREAT";
})(Rank = exports.Rank || (exports.Rank = {}));
exports.rankLevels = [
    { points: -1, rank: Rank.BANNED },
    { points: 0, rank: Rank.POKE },
    { points: 250, rank: Rank.GREAT },
    { points: 1000, rank: Rank.ULTRA },
    { points: 2500, rank: Rank.MASTER }
];
