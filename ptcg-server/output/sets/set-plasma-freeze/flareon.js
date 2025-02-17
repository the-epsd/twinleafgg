"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flareon = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Flareon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.tags = [game_1.CardTag.TEAM_PLASMA];
        this.cardType = R;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Vengeance',
                cost: [C, C],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 10 more damage for each Pokémon in your discard pile.'
            },
            { name: 'Heat Tackle', cost: [R, C, C], damage: 90, text: 'This Pokémon does 10 damage to itself.' }
        ];
        this.set = 'PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Flareon';
        this.fullName = 'Flareon PLF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let pokemonCount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof game_1.PokemonCard)
                    pokemonCount += 1;
            });
            effect.damage += pokemonCount * 10;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
        }
        return state;
    }
}
exports.Flareon = Flareon;
