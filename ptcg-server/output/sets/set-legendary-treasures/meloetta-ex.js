"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeloettaEX = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MeloettaEX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_EX];
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Brilliant Voice',
                cost: [C, C],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep. If tails, the Defending Pokémon is now Confused.'
            },
            {
                name: 'Round',
                cost: [P, P, P],
                damage: 30,
                damageCalculation: 'x',
                text: 'Does 30 damage times the number of your Pokémon that have the Round attack.'
            },
        ];
        this.set = 'LTR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'RC11';
        this.name = 'Meloetta EX';
        this.fullName = 'Meloetta EX LTR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            state = prefabs_1.COIN_FLIP_PROMPT(store, state, player, (result) => {
                if (result) {
                    attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
                }
                else {
                    attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            let roundPokemon = 0;
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.attacks.some(attack => attack.name === 'Round')) {
                    roundPokemon += 1;
                }
            });
            effect.damage = effect.attack.damage * roundPokemon;
        }
        return state;
    }
}
exports.MeloettaEX = MeloettaEX;
