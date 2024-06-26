"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanGrimer = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class AlolanGrimer extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.DARK;
        this.hp = 80;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.resistance = [{ type: game_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Collect',
                cost: [],
                damage: 0,
                text: 'Draw 2 cards.'
            }, {
                name: 'Sludge Bomb',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'UNM';
        this.name = 'Alolan Grimer';
        this.fullName = 'Alolan Grimer UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '127';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 2);
            return state;
        }
        return state;
    }
}
exports.AlolanGrimer = AlolanGrimer;
