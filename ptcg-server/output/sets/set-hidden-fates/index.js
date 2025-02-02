"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHiddenFates = void 0;
const alolan_vulpix_1 = require("./alolan-vulpix");
const charmander_1 = require("./charmander");
const erikas_hospitality_1 = require("./erikas-hospitality");
const psyduck_1 = require("./psyduck");
const shiny_vault_1 = require("./shiny-vault");
exports.setHiddenFates = [
    new charmander_1.Charmander(),
    new erikas_hospitality_1.ErikasHospitality(),
    new psyduck_1.Psyduck(),
    // FA/Shiny Vault
    new alolan_vulpix_1.AlolanVulpix(),
    new shiny_vault_1.WooperSV(),
    new shiny_vault_1.QuagsireSV()
];
