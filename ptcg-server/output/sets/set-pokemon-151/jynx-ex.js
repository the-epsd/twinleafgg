"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jynxex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Jynxex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 200;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Heart-Stopping Kiss',
                cost: [W, C, C],
                damage: 0,
                text: 'If your opponent\'s Active Pokémon is Asleep, it is Knocked Out.'
            },
            {
                name: 'Icy Wind',
                cost: [W, W, W],
                damage: 120,
                text: 'Your opponent\'s Active Pokémon is now Asleep.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '124';
        this.name = 'Jynx ex';
        this.fullName = 'Jynx ex MEW';
    }
    reduceEffect(store, state, effect) {
        // Heart-Stopping Kiss
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            if (opponent.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP)) {
                const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                dealDamage.target = opponent.active;
                store.reduceEffect(state, dealDamage);
            }
        }
        // Icy Wind
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = effect.opponent;
            prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
        return state;
    }
}
exports.Jynxex = Jynxex;
