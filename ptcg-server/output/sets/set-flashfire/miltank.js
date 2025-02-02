"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miltank = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class Miltank extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Powerful Friends',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'If you have any Stage 2 Pokemon on your Bench, ' +
                    'this attack does 70 more damage.'
            },
            {
                name: 'Hammer In',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            },
        ];
        this.set = 'FLF';
        this.name = 'Miltank';
        this.fullName = 'Miltank FLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let hasStage2 = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.stage === card_types_1.Stage.STAGE_2) {
                    hasStage2 = true;
                }
            });
            if (hasStage2) {
                effect.damage += 70;
            }
        }
        return state;
    }
}
exports.Miltank = Miltank;
