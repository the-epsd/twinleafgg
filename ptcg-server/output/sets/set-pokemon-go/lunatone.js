"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lunatone = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Lunatone extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Cycle Draw',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Discard a card from your hand. If you do, draw 3 cards.'
            },
            {
                name: 'Moon Kinesis',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each [P] Energy ' +
                    'attached to this Pokémon.'
            }
        ];
        this.set = 'PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Lunatone';
        this.fullName = 'Lunatone PGO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(cards, player.discard);
                player.deck.moveTo(player.hand, 3);
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => cardType === card_types_1.CardType.PSYCHIC || cardType === card_types_1.CardType.ANY).length;
            });
            effect.damage += energyCount * 30;
        }
        return state;
    }
}
exports.Lunatone = Lunatone;
