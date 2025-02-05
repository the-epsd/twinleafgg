"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glimmet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Glimmet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 70;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Poison Shard',
                cost: [F, F],
                damage: 20,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }];
        this.set = 'OBF';
        this.regulationMark = 'G';
        this.setNumber = '122';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Glimmet';
        this.fullName = 'Glimmet OBF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
        return state;
    }
}
exports.Glimmet = Glimmet;
