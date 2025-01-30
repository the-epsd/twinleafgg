"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSunAndMoon = void 0;
const dartrix_1 = require("../set-shining-fates/dartrix");
const alolan_grimer_1 = require("./alolan-grimer");
const alolan_muk_1 = require("./alolan-muk");
const alolan_rattata_1 = require("./alolan_rattata");
const card_images_1 = require("./card-images");
const decidueye_gx_1 = require("./decidueye-gx");
const dragonair_1 = require("./dragonair");
const eevee_1 = require("./eevee");
const espeon_gx_1 = require("./espeon-gx");
const fomantis_1 = require("./fomantis");
const golduck_1 = require("./golduck");
const herdier_1 = require("./herdier");
const lurantis_gx_1 = require("./lurantis-gx");
const oranguru_1 = require("./oranguru");
const passimian_1 = require("./passimian");
const professor_kukui_1 = require("./professor-kukui");
const rainbow_energy_1 = require("./rainbow-energy");
const repel_1 = require("./repel");
const rotom_dex_1 = require("./rotom-dex");
const rowlet_1 = require("./rowlet");
const timer_ball_1 = require("./timer-ball");
exports.setSunAndMoon = [
    new alolan_grimer_1.AlolanGrimer(),
    new alolan_muk_1.AlolanMuk(),
    new alolan_rattata_1.AlolanRattata(),
    new dartrix_1.Dartrix(),
    new decidueye_gx_1.DecidueyeGX(),
    new dragonair_1.Dragonair(),
    new eevee_1.Eevee(),
    new espeon_gx_1.EspeonGX(),
    new fomantis_1.Fomantis(),
    new golduck_1.Golduck(),
    new herdier_1.Herdier(),
    new lurantis_gx_1.LurantisGX(),
    new oranguru_1.Oranguru(),
    new passimian_1.PassimianSUM(),
    new professor_kukui_1.ProfessorKukui(),
    new rainbow_energy_1.RainbowEnergy(),
    new rotom_dex_1.RotomDex(),
    new rowlet_1.Rowlet(),
    new repel_1.Repel(),
    new timer_ball_1.TimerBall(),
    // Reprints
    new card_images_1.NestBallSUM(),
    new card_images_1.RareCandySUM(),
    new card_images_1.EnergyRetrievalSUM(),
    new card_images_1.ExpShareSUM(),
    // Full Arts
    new card_images_1.RotomDexSR(),
];
