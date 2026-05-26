import { CardType, EnergyCard, PlayerType, Energy } from '../../game';
import { SimpleScore } from './score';
export class EnergyScore extends SimpleScore {
    getScore(state, playerId) {
        const player = this.getPlayer(state, playerId);
        const scores = this.options.scores.energy;
        let score = 0;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemon, target) => {
            let missing = this.getMissingEnergies(cardList, pokemon.retreat);
            pokemon.attacks.forEach(a => {
                const missing2 = this.getMissingEnergies(cardList, a.cost);
                missing = this.mergeMissing(missing, missing2);
            });
            const multipier = cardList === player.active
                ? scores.active
                : scores.bench;
            missing.forEach(p => {
                score += p === CardType.ANY
                    ? scores.missingColorless * multipier
                    : scores.missingMatch * multipier;
            });
        });
        return score;
    }
    mergeMissing(missing1, missing2) {
        let any1 = 0;
        missing1.forEach(c => { any1 += c === CardType.ANY ? 1 : 0; });
        missing1 = missing1.filter(c => c !== CardType.ANY);
        let any2 = 0;
        missing2.forEach(c => { any2 += c === CardType.ANY ? 1 : 0; });
        missing2 = missing2.filter(c => c !== CardType.ANY);
        missing1.forEach(c => {
            const index = missing2.indexOf(c);
            if (index !== -1) {
                missing2.splice(index, 1);
            }
            else if (any2 > 0) {
                any2 -= 1;
            }
        });
        missing2.forEach(c => {
            missing1.push(c);
        });
        const max = Math.max(any1, any2);
        for (let i = 0; i < max; i++) {
            missing1.push(CardType.ANY);
        }
        return missing1;
    }
    getMissingEnergies(cardList, cost) {
        if (cost.length === 0) {
            return [];
        }
        const provided = [];
        cardList.cards.forEach(card => {
            if (card instanceof EnergyCard) {
                card.provides.forEach(energy => provided.push(energy));
            }
        });
        const missing = [];
        let colorless = 0;
        // First remove from array cards with specific energy types
        cost.forEach(costType => {
            switch (costType) {
                case CardType.ANY:
                case CardType.NONE:
                    break;
                case CardType.COLORLESS:
                    colorless += 1;
                    break;
                default: {
                    if (typeof costType === 'string') {
                        const energyType = Energy[costType];
                        if (energyType !== undefined) {
                            const index = provided.findIndex(energy => energy === energyType);
                            if (index !== -1) {
                                provided.splice(index, 1);
                            }
                            else {
                                missing.push(energyType);
                            }
                        }
                    }
                    else {
                        const index = provided.findIndex(energy => energy === costType);
                        if (index !== -1) {
                            provided.splice(index, 1);
                        }
                        else {
                            missing.push(costType);
                        }
                    }
                }
            }
        });
        colorless -= provided.length;
        for (let i = 0; i < colorless; i++) {
            missing.push(CardType.ANY);
        }
        return missing;
    }
}
