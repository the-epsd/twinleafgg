"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Woobat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Woobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Nasal Suction',
                cost: [C],
                damage: 0,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Air Cutter',
                cost: [P],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            },
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '87';
        this.name = 'Woobat';
        this.fullName = 'Woobat CEC';
        this.NASAL_SUCTION_MARKER = 'NASAL_SUCTION_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Nasal Suction
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            opponent.active.marker.addMarker(this.NASAL_SUCTION_MARKER, this);
            opponent.marker.addMarker(this.NASAL_SUCTION_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.marker.hasMarker(this.NASAL_SUCTION_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.NASAL_SUCTION_MARKER, this)) {
            effect.player.marker.removeMarker(this.NASAL_SUCTION_MARKER, this);
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.marker.hasMarker(this.NASAL_SUCTION_MARKER, this)) {
                    cardList.marker.removeMarker(this.NASAL_SUCTION_MARKER, this);
                }
            });
        }
        // Air Cutter
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => { if (!result) {
                effect.damage = 0;
            } });
        }
        return state;
    }
}
exports.Woobat = Woobat;
