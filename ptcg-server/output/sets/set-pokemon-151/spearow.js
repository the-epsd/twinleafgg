"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spearow = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Spearow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Evolutionary Advantage',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you go second, this Pokémon can evolve during your first turn.',
            }];
        this.attacks = [{ name: 'Speed Dive', cost: [C], damage: 10, text: '' }];
        this.set = 'MEW';
        this.name = 'Spearow';
        this.fullName = 'Spearow MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this))
                return state;
            prefabs_1.CAN_EVOLVE_ON_FIRST_TURN_GOING_SECOND(state, player, cardList);
        }
        return state;
    }
}
exports.Spearow = Spearow;
