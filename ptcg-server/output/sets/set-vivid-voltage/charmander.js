"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmander = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Charmander extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Collect', cost: [card_types_1.CardType.FIRE], damage: 0, text: 'Draw a card.' },
            { name: 'Flare', cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE], damage: 30, text: '' }
        ];
        this.set = 'VIV';
        this.name = 'Charmander';
        this.fullName = 'Charmander VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 1);
            return state;
        }
        return state;
    }
}
exports.Charmander = Charmander;
