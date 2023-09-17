export var Rank;
(function (Rank) {
    Rank["JUNIOR"] = "JUNIOR";
    Rank["SENIOR"] = "SENIOR";
    Rank["MASTER"] = "MASTER";
    Rank["ADMIN"] = "ADMIN";
})(Rank || (Rank = {}));
export const rankLevels = [
    { points: 0, rank: Rank.JUNIOR },
    { points: 1000, rank: Rank.SENIOR },
    { points: 3000, rank: Rank.MASTER }
];
