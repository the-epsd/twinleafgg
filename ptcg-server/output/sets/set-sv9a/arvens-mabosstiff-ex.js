"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArvensMabosstiffex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class ArvensMabosstiffex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ARVENS];
        this.regulationMark = 'I';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Arven\'s Maschiff';
        this.cardType = D;
        this.hp = 270;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Hustle Tackle',
                cost: [C],
                damage: 30,
                damageCalculation: '+',
                text: 'If this Pokemon has no damage counters on it, this attack does 120 more damage.'
            },
            {
                name: 'Boss\'s Headbutt',
                cost: [C, C, C],
                damage: 210,
                text: 'During your next turn, this Pokémon can\'t use Boss\'s Headbutt.'
            },
        ];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Arven\'s Mabosstiff ex';
        this.fullName = 'Arven\'s Mabosstiff ex SV9a';
        // for preventing the pokemon from attacking on the next turn
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Hustle Tackle
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (effect.player.active.damage === 0) {
                effect.damage += 120;
            }
        }
        // Boss's Headbutt
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            if (prefabs_1.HAS_MARKER(this.ATTACK_USED_MARKER, effect.player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            prefabs_1.ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
        }
        // removing the markers for preventing the pokemon from attacking
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
            prefabs_1.REMOVE_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.ATTACK_USED_MARKER, effect.player, this)) {
            prefabs_1.ADD_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);
        }
        return state;
    }
}
exports.ArvensMabosstiffex = ArvensMabosstiffex;
