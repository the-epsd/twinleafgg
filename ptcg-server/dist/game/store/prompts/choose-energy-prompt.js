import { CardType } from '../card/card-types';
import { Prompt } from './prompt';
import { StateUtils } from '../state-utils';
export const ChooseEnergyPromptType = 'Choose energy';
export class ChooseEnergyPrompt extends Prompt {
    constructor(playerId, message, energy, cost, options) {
        super(playerId);
        this.message = message;
        this.energy = energy;
        this.cost = cost;
        this.type = ChooseEnergyPromptType;
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
        if (!StateUtils.checkExactEnergy(result, this.cost)) {
            return false;
        }
        return true;
    }
    getCostThatCanBePaid() {
        const result = this.cost.slice();
        const provides = this.energy.slice();
        const costs = this.cost.filter(c => c !== CardType.COLORLESS);
        const colorlessCount = result.length - costs.length;
        while (costs.length > 0 && provides.length > 0) {
            const cost = costs[0];
            let index = provides.findIndex(p => p.provides.includes(cost));
            if (index === -1) {
                // concrete energy not found, try to use rainbow energies
                index = provides.findIndex(p => p.provides.includes(CardType.ANY));
            }
            if (index !== -1) {
                // Energy can be paid, so remove that energy from the provides
                const provide = provides[index];
                provides.splice(index, 1);
                provide.provides.forEach(c => {
                    if (c === CardType.ANY && costs.length > 0) {
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
            const costToDelete = result.indexOf(CardType.COLORLESS);
            if (costToDelete !== -1) {
                result.splice(costToDelete, 1);
            }
        }
        return result;
    }
}
