"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPaldeaEvolved = void 0;
const artazon_1 = require("./artazon");
const baxcalibur_1 = require("./baxcalibur");
const boss_orders_1 = require("./boss-orders");
const chien_pao_ex_1 = require("./chien-pao-ex");
const delivery_drone_1 = require("./delivery-drone");
const flamigo_1 = require("./flamigo");
const murkrow_1 = require("./murkrow");
const spiritomb_1 = require("./spiritomb");
const super_rod_1 = require("./super-rod");
const wattrel_1 = require("./wattrel");
//import { Iono } from './iono';
exports.setPaldeaEvolved = [
    new artazon_1.Artazon(),
    new delivery_drone_1.DeliveryDrone(),
    //new Iono(),
    new baxcalibur_1.Baxcalibur(),
    new chien_pao_ex_1.ChienPaoex(),
    new super_rod_1.SuperRod(),
    new murkrow_1.Murkrow(),
    new wattrel_1.Wattrel(),
    new flamigo_1.Flamigo(),
    new spiritomb_1.Spiritomb(),
    new boss_orders_1.BossOrders(),
];
