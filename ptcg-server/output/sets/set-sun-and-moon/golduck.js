"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Golduck = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Golduck extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.evolvesFrom = 'Psyduck';
        this.attacks = [{
                name: 'Scratch',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
            {
                name: 'Double Jet',
                cost: [card_types_1.CardType.WATER],
                damage: 60,
                text: 'Discard up to 2 [W] Energy cards from your hand. This attack does 60 damage for each card you discarded in this way.'
            }];
        this.set = 'SUM';
        this.setNumber = '29';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Golduck';
        this.fullName = 'Golduck SUM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: true, min: 0, max: 2 }), cards => {
                cards = cards || [];
                effect.damage = cards.length * 60;
                player.hand.moveCardsTo(cards, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.Golduck = Golduck;
