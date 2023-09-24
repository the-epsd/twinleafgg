"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNextDestinies = void 0;
const level_ball_1 = require("./level-ball");
const mewtwo_ex_1 = require("./mewtwo-ex");
const musharna_1 = require("./musharna");
const nest_ball_1 = require("./nest-ball");
const pokemon_center_1 = require("./pokemon-center");
const prism_energy_1 = require("./prism-energy");
const reshiram_ex_1 = require("./reshiram-ex");
const skyarrow_bridge_1 = require("./skyarrow-bridge");
const zekrom_ex_1 = require("./zekrom-ex");
exports.setNextDestinies = [
    new level_ball_1.LevelBall(),
    new nest_ball_1.NestBall(),
    new prism_energy_1.PrismEnergy(),
    new reshiram_ex_1.ReshiramEx(),
    new skyarrow_bridge_1.SkyarrowBridge(),
    new zekrom_ex_1.ZekromEx(),
    new mewtwo_ex_1.MewtwoEx(),
    new musharna_1.Musharna(),
    new pokemon_center_1.PokemonCenter(),
];
