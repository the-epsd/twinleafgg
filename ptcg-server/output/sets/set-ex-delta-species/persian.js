"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persian = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Persian extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Meowth';
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Prowl',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: false,
                text: 'Once during your turn, when you play Persian from your hand to evolve 1 of your Pokémon, you may search your deck for any 1 card and put it into your hand. Shuffle your deck afterward.'
            }
        ];
        this.attacks = [
            {
                name: 'Snap Tail',
                cost: [C, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
        ];
        this.set = 'DS';
        this.setNumber = '50';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Persian';
        this.fullName = 'Persian DS';
    }
    reduceEffect(store, state, effect) {
        // Prowl
        if (prefabs_1.JUST_EVOLVED(effect, this) && !prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
            if (prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, result => {
                if (result) {
                    const player = effect.player;
                    prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, 0, 1);
                }
            }))
                return state;
        }
        // Snap Tail
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state);
        }
        return state;
    }
}
exports.Persian = Persian;
