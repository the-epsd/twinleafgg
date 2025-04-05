"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEXTeamRocketReturns = void 0;
const pokemon_retriever_1 = require("./pokemon-retriever");
const pow_hand_extension_1 = require("./pow-hand-extension");
const rockets_admin_1 = require("./rockets-admin");
const surprise_time_machine_1 = require("./surprise-time-machine");
exports.setEXTeamRocketReturns = [
    new pokemon_retriever_1.PokemonRetriever(),
    new pow_hand_extension_1.PowHandExtension(),
    new rockets_admin_1.RocketsAdmin(),
    new surprise_time_machine_1.SurpriseTimeMachine()
];
