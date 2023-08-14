"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankLevels = exports.Rank = void 0;
var Rank;
(function (Rank) {
    Rank["JUNIOR"] = "JUNIOR";
    Rank["SENIOR"] = "SENIOR";
    Rank["MASTER"] = "MASTER";
    Rank["ADMIN"] = "ADMIN";
})(Rank = exports.Rank || (exports.Rank = {}));
exports.rankLevels = [
    { points: 0, rank: Rank.JUNIOR },
    { points: 1000, rank: Rank.SENIOR },
    { points: 3000, rank: Rank.MASTER }
];
