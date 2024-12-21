"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHiddenFates = void 0;
const quagsire_1 = require("../set-dragons-majesty/quagsire");
const wooper_1 = require("../set-dragons-majesty/wooper");
const alolan_vulpix_1 = require("./alolan-vulpix");
const charmander_1 = require("./charmander");
const erikas_hospitality_1 = require("./erikas-hospitality");
const psyduck_1 = require("./psyduck");
exports.setHiddenFates = [
    new charmander_1.Charmander(),
    new erikas_hospitality_1.ErikasHospitality(),
    new psyduck_1.Psyduck(),
    // Full s/Shiny Vault
    new alolan_vulpix_1.AlolanVulpix(),
    new wooper_1.Wooper(),
    new quagsire_1.Quagsire()
];
