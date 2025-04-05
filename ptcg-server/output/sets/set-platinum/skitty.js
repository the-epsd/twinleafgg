"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skitty = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Skitty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F, value: +10 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Heal Bell',
                cost: [],
                damage: 0,
                text: 'Remove 1 damage counter from each of your Pokémon.'
            },
            {
                name: 'Take Down',
                cost: [C],
                damage: 20,
                text: 'Skitty does 10 damage to itself.'
            },
        ];
        this.set = 'PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Skitty';
        this.fullName = 'Skitty PL';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 10);
                state = store.reduceEffect(state, healEffect);
                return state;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
            dealDamage.target = player.active;
            store.reduceEffect(state, dealDamage);
            return state;
        }
        return state;
    }
}
exports.Skitty = Skitty;
