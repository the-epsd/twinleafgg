"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victiniex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Victiniex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = R;
        this.hp = 190;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Strafe',
                cost: [R],
                damage: 30,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Victory Flame',
                cost: [R, R, C],
                damage: 220,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Victini ex';
        this.fullName = 'Victini ex OBF';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (prefabs_1.HAS_MARKER(this.ATTACK_USED_MARKER, this, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
                if (result) {
                    prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            if (prefabs_1.HAS_MARKER(this.ATTACK_USED_MARKER, this, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            prefabs_1.ADD_MARKER(this.ATTACK_USED_MARKER, this, this);
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
        }
        return state;
    }
}
exports.Victiniex = Victiniex;
