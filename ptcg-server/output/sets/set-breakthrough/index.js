"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBreakthrough = void 0;
const brigette_1 = require("./brigette");
const buddy_buddy_rescue_1 = require("./buddy-buddy-rescue");
const florges_1 = require("./florges");
const magneton_1 = require("./magneton");
const mr_mime_1 = require("./mr-mime");
const octillery_1 = require("./octillery");
const parallel_city_1 = require("./parallel-city");
const town_map_1 = require("./town-map");
exports.setBreakthrough = [
    new brigette_1.Brigette(),
    new buddy_buddy_rescue_1.BuddyBuddyRescue(),
    new magneton_1.Magneton(),
    new florges_1.Florges(),
    new mr_mime_1.MrMime(),
    new town_map_1.TownMap(),
    new octillery_1.Octillery(),
    new parallel_city_1.ParallelCity()
];
