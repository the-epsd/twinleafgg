"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPaldeaEvolved = void 0;
const baxcalibur_1 = require("./baxcalibur");
const chien_pao_ex_1 = require("./chien-pao-ex");
const delivery_drone_1 = require("./delivery-drone");
const iono_1 = require("./iono");
exports.setPaldeaEvolved = [
    new delivery_drone_1.DeliveryDrone(),
    new iono_1.Iono(),
    new baxcalibur_1.Baxcalibur(),
    new chien_pao_ex_1.ChienPaoex()
];
