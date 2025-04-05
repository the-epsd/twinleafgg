"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kecleon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Kecleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Reactive Colors',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If Kecleon has any React Energy cards attached to it, Kecleon is [G], [R], [W], [L], [P], and [F] type.'
            }];
        this.attacks = [{
                name: 'Tongue Whip',
                cost: [C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Quick Attack',
                cost: [C, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage.'
            }];
        this.set = 'LM';
        this.name = 'Kecleon';
        this.fullName = 'Kecleon LM';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && effect.target.getPokemonCard() === this && !prefabs_1.IS_POKEBODY_BLOCKED(store, state, game_1.StateUtils.findOwner(state, effect.target), this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    const energies = new game_1.CardList();
                    energies.cards = cardList.cards.filter(card => card instanceof game_1.EnergyCard && card.name === 'React Energy');
                    if (energies.cards.length === 0) {
                        effect.cardTypes = [C];
                        return state;
                    }
                    else {
                        effect.cardTypes = [G, R, W, L, P, F];
                        return state;
                    }
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
        }
        return state;
    }
}
exports.Kecleon = Kecleon;
