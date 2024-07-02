"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrapionV = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const card_types_2 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class DrapionV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Wild Style',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon\'s attacks cost C less for each of your opponent\'s Single Strike, Rapid Strike, and Fusion Strike Pokémon in play.'
            }];
        this.attacks = [
            {
                name: 'Dynamic Tail',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 190,
                text: 'This attack also does 60 damage to 1 of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Drapion V';
        this.fullName = 'Drapion V LOR';
    }
    // Implement ability
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let wildStyleCount = 0;
            // Check opponent's active Pokemon
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && (opponentActive.tags.includes(card_types_2.CardTag.FUSION_STRIKE) ||
                opponentActive.tags.includes(card_types_2.CardTag.RAPID_STRIKE) ||
                opponentActive.tags.includes(card_types_2.CardTag.SINGLE_STRIKE))) {
                wildStyleCount += 1;
            }
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            // Check opponent's benched Pokemon
            opponent.bench.forEach(cardList => {
                cardList.cards.forEach(card => {
                    if (card instanceof pokemon_card_1.PokemonCard &&
                        (card.tags.includes(card_types_2.CardTag.FUSION_STRIKE) ||
                            card.tags.includes(card_types_2.CardTag.RAPID_STRIKE) ||
                            card.tags.includes(card_types_2.CardTag.SINGLE_STRIKE))) {
                        wildStyleCount += 1;
                    }
                });
            });
            // Reduce attack cost by removing 1 Colorless energy for each counted Pokemon
            const attackCost = this.attacks[0].cost;
            const colorlessToRemove = wildStyleCount;
            this.attacks[0].cost = attackCost.filter(c => c !== card_types_1.CardType.COLORLESS).slice(0, -colorlessToRemove);
        }
        return state;
    }
}
exports.DrapionV = DrapionV;
