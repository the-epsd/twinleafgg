"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toxel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Toxel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Slight Intrusion',
                cost: [L],
                damage: 30,
                text: 'This Pokémon also does 10 damage to itself.'
            },
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Toxel';
        this.fullName = 'Toxel OBF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
            dealDamage.target = player.active;
            store.reduceEffect(state, dealDamage);
            return state;
        }
        return state;
    }
}
exports.Toxel = Toxel;
