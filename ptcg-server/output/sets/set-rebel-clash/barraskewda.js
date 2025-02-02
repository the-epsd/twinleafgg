"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Barraskewda = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Barraskewda extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 120;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.evolvesFrom = 'Arrokuda';
        this.attacks = [{
                name: 'Peck',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            },
            {
                name: 'Spiral Jet',
                cost: [card_types_1.CardType.WATER],
                damage: 130,
                text: 'Discard 2 [W] Energy cards from your hand. If you don\'t, this attack does nothing.'
            }];
        this.set = 'RCL';
        this.setNumber = '53';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Barraskewda';
        this.fullName = 'Barraskewda RCL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let numberOfEnergy = 0;
            player.hand.cards.forEach(card => {
                if (card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Water Energy') {
                    numberOfEnergy++;
                }
            });
            if (numberOfEnergy < 2) {
                effect.damage = 0;
                return state;
            }
            if (numberOfEnergy >= 2) {
                state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: false, min: 2, max: 2 }), cards => {
                    cards = cards || [];
                    player.hand.moveCardsTo(cards, player.discard);
                    return state;
                });
            }
        }
        return state;
    }
}
exports.Barraskewda = Barraskewda;
