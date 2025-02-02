"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseEnergyPromptResolver = void 0;
const game_1 = require("../../game");
const prompt_resolver_1 = require("./prompt-resolver");
const choose_energy_prompt_1 = require("../../game/store/prompts/choose-energy-prompt");
class ChooseEnergyPromptResolver extends prompt_resolver_1.PromptResolver {
    resolvePrompt(state, player, prompt) {
        if (prompt instanceof choose_energy_prompt_1.ChooseEnergyPrompt) {
            let result = [];
            const provides = prompt.energy.slice();
            const costs = prompt.cost.filter(c => c !== game_1.CardType.COLORLESS);
            while (costs.length > 0 && provides.length > 0) {
                const cost = costs[0];
                let index = provides.findIndex(p => p.provides.includes(cost));
                if (index === -1) {
                    // concrete energy not found, try to use rainbow energies
                    index = provides.findIndex(p => p.provides.includes(game_1.CardType.ANY));
                }
                if (index === -1) {
                    break; // impossible to pay for the cost
                }
                const provide = provides[index];
                provides.splice(index, 1);
                result.push(provide);
                provide.provides.forEach(c => {
                    if (c === game_1.CardType.ANY && costs.length > 0) {
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
            if (costs.length > 0) {
                // Impossible to pay for the cost, try to cancel
                return new game_1.ResolvePromptAction(prompt.id, null);
            }
            // Only colorless energies are remaining to pay
            // Sort rest of the provided energies by the score
            // (Number of provided energy, provided type)
            provides.sort((p1, p2) => {
                const score1 = this.getEnergyCardScore(p1.provides);
                const score2 = this.getEnergyCardScore(p2.provides);
                return score1 - score2;
            });
            // Add energies until all colorless cost is paid
            while (provides.length > 0 && !game_1.StateUtils.checkEnoughEnergy(result, prompt.cost)) {
                const provide = provides.shift();
                if (provide !== undefined) {
                    result.push(provide);
                }
            }
            // Make sure we have used only the required energies to pay
            let needCheck = true;
            while (needCheck) {
                needCheck = false;
                for (let i = 0; i < result.length; i++) {
                    const tempCards = result.slice();
                    tempCards.splice(i, 1);
                    const enough = game_1.StateUtils.checkEnoughEnergy(tempCards, prompt.cost);
                    if (enough) {
                        result = tempCards;
                        needCheck = true;
                        break;
                    }
                }
            }
            return new game_1.ResolvePromptAction(prompt.id, result);
        }
    }
    getEnergyCardScore(provides) {
        let score = 0;
        provides.forEach(c => {
            if (c === game_1.CardType.COLORLESS) {
                score += 2;
            }
            else if (c === game_1.CardType.ANY) {
                score += 10;
            }
            else {
                score += 3;
            }
        });
        return score;
    }
}
exports.ChooseEnergyPromptResolver = ChooseEnergyPromptResolver;
