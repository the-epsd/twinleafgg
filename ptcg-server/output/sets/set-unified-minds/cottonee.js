"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cottonee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Cottonee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 60;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Dust Gathering',
                cost: [C],
                damage: 0,
                text: 'Draw a card.'
            }];
        this.set = 'UNM';
        this.name = 'Cottonee';
        this.fullName = 'Cottonee UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '143';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            player.deck.moveTo(player.hand, 1);
            return state;
        }
        return state;
    }
}
exports.Cottonee = Cottonee;
