"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charmeleon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Charmeleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charmander';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Slash',
                cost: [card_types_1.CardType.FIRE],
                damage: 20,
                text: ''
            },
            {
                name: 'Raging Flames',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 60,
                text: 'Discard the top 3 cards of your deck.'
            }
        ];
        this.set = 'VIV';
        this.name = 'Charmeleon';
        this.fullName = 'Charmeleon VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            player.deck.moveTo(player.discard, 3);
            return state;
        }
        return state;
    }
}
exports.Charmeleon = Charmeleon;
