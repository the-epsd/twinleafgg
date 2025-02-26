"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Farigiraf = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Farigiraf extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Girafarig';
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'One-derful Rumble',
                cost: [C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'This attack does 40 damage for each of your Stage 1 Pokémon in play.'
            },
            {
                name: 'Eerie Wave',
                cost: [P, C, C],
                damage: 80,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Farigiraf';
        this.fullName = 'Farigiraf TWM';
    }
    reduceEffect(store, state, effect) {
        // One-derful Rumble
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let stage1s = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                var _a;
                if (((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_1) {
                    stage1s++;
                }
            });
            effect.damage = 40 * stage1s;
        }
        // Eerie Wave
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Farigiraf = Farigiraf;
