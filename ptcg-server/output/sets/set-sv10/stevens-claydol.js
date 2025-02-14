"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StevensClaydol = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class StevensClaydol extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Steven\'s Baltoy';
        this.tags = [card_types_1.CardTag.STEVENS];
        this.cardType = P;
        this.hp = 120;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Eerie Light',
                cost: [P],
                damage: 20,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }, {
                name: 'Clay Blast',
                cost: [P, P, C],
                damage: 220,
                text: 'Discard all Energy from this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'SVOD';
        this.setNumber = '2';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Steven\'s Claydol';
        this.fullName = 'Steven\'s Claydol SVOD';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
        }
        return state;
    }
}
exports.StevensClaydol = StevensClaydol;
