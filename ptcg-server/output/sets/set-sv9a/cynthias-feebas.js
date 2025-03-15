"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasFeebas = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class CynthiasFeebas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.CYNTHIAS];
        this.cardType = W;
        this.hp = 30;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Undulate',
                cost: [C],
                damage: 10,
                text: 'If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.setNumber = '28';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cynthia\'s Feebas';
        this.fullName = 'Cynthia\'s Feebas SV9a';
        this.UNDULATE_MARKER = 'UNDULATE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    this.marker.addMarker(this.UNDULATE_MARKER, this);
                    prefabs_1.ADD_MARKER(this.UNDULATE_MARKER, effect.opponent, this);
                }
            });
        }
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.PutCountersEffect) && effect.target.getPokemonCard() === this) {
            if (this.marker.hasMarker(this.UNDULATE_MARKER, this)) {
                effect.preventDefault = true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.UNDULATE_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.UNDULATE_MARKER, effect.player, this);
            this.marker.removeMarker(this.UNDULATE_MARKER, this);
        }
        return state;
    }
}
exports.CynthiasFeebas = CynthiasFeebas;
