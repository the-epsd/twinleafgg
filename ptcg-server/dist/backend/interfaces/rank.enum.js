export var Rank;
(function (Rank) {
    Rank["JUNIOR"] = "JUNIOR";
    Rank["SENIOR"] = "SENIOR";
    Rank["ULTRA"] = "ULTRA";
    Rank["MASTER"] = "MASTER";
    Rank["ADMIN"] = "ADMIN";
    Rank["BANNED"] = "BANNED";
    Rank["POKE"] = "POKE";
    Rank["GREAT"] = "GREAT";
})(Rank || (Rank = {}));
export const rankLevels = [
    { points: -1, rank: Rank.BANNED },
    { points: 0, rank: Rank.POKE },
    { points: 250, rank: Rank.GREAT },
    { points: 1000, rank: Rank.ULTRA },
    { points: 2500, rank: Rank.MASTER }
];
