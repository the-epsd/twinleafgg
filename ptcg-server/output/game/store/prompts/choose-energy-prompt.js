"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseEnergyPrompt = exports.ChooseEnergyPromptType = void 0;
const card_types_1 = require("../card/card-types");
const prompt_1 = require("./prompt");
const state_utils_1 = require("../state-utils");
exports.ChooseEnergyPromptType = 'Choose energy';
class ChooseEnergyPrompt extends prompt_1.Prompt {
    constructor(playerId, message, energy, cost, options) {
        super(playerId);
        this.message = message;
        this.energy = energy;
        this.cost = cost;
        this.type = exports.ChooseEnergyPromptType;
        // Default options
        this.options = Object.assign({}, {
            allowCancel: true
        }, options);
        if (this.options.allowCancel === false) {
            this.cost = this.getCostThatCanBePaid();
        }
    }
    decode(result) {
        if (result === null) {
            return null;
        }
        const energy = this.energy;
        return result.map(index => energy[index]);
    }
    validate(result) {
        if (result === null) {
            return this.options.allowCancel;
        }
        if (!state_utils_1.StateUtils.checkExactEnergy(result, this.cost)) {
            return false;
        }
        return true;
    }
    getCostThatCanBePaid() {
        const result = this.cost.slice();
        const provides = this.energy.slice();
        const costs = this.cost.filter(c => c !== card_types_1.CardType.COLORLESS);
        const colorlessCount = result.length - costs.length;
        while (costs.length > 0 && provides.length > 0) {
            const cost = costs[0];
            let index = provides.findIndex(p => p.provides.includes(cost));
            if (index === -1) {
                // concrete energy not found, try to use rainbow energies
                index = provides.findIndex(p => p.provides.includes(card_types_1.CardType.ANY));
            }
            if (index !== -1) {
                // Energy can be paid, so remove that energy from the provides
                const provide = provides[index];
                provides.splice(index, 1);
                provide.provides.forEach(c => {
                    if (c === card_types_1.CardType.ANY && costs.length > 0) {
                        costs.shift();
                    }
                    else {
                        const i = costs.indexOf(c);
                        if (i !== -1) {
                            costs.splice(i, 1);
                        }
                    }
                });
            }
            else {
                // Impossible to pay for this cost
                costs.shift();
                const costToDelete = result.indexOf(cost);
                if (costToDelete !== -1) {
                    result.splice(costToDelete, 1);
                }
            }
        }
        let energyLeft = 0;
        for (const energy of provides) {
            energyLeft += energy.provides.length;
        }
        const colorlessToDelete = Math.max(0, colorlessCount - energyLeft);
        for (let i = 0; i < colorlessToDelete; i++) {
            const costToDelete = result.indexOf(card_types_1.CardType.COLORLESS);
            if (costToDelete !== -1) {
                result.splice(costToDelete, 1);
            }
        }
        return result;
    }
}
exports.ChooseEnergyPrompt = ChooseEnergyPrompt;
