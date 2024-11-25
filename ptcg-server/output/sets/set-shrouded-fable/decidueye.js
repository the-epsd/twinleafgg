"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decidueye = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Decidueye extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dartrix';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Stock Up on Feathers',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw cards until you have 7 cards in your hand.'
            },
            {
                name: 'Strong Shot',
                cost: [card_types_1.CardType.GRASS],
                damage: 170,
                text: 'Discard 1 Basic Grass Energy from your hand. If you can\'t, this attack does nothing.'
            }
        ];
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Decidueye';
        this.fullName = 'Decidueye SFA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            while (player.hand.cards.length < 7) {
                if (player.deck.cards.length === 0) {
                    break;
                }
                player.deck.moveTo(player.hand, 1);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Prompt player to choose cards to discard 
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Grass Energy' }, { allowCancel: false, min: 0, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    effect.damage = 0;
                    return state;
                }
                player.hand.moveCardsTo(cards, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.Decidueye = Decidueye;
