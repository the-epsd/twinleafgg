export var Rank;
(function (Rank) {
    Rank["JUNIOR"] = "JUNIOR";
    Rank["SENIOR"] = "SENIOR";
    Rank["ULTRA"] = "ULTRA";
    Rank["MASTER"] = "MASTER";
    Rank["ADMIN"] = "ADMIN";
})(Rank || (Rank = {}));
export const rankLevels = [
    { points: 0, rank: Rank.JUNIOR },
    { points: 500, rank: Rank.SENIOR },
    { points: 1000, rank: Rank.ULTRA },
    { points: 2500, rank: Rank.MASTER }
];
