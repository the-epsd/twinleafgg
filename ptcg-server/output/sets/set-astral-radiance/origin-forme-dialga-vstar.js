"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginFormeDialgaVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class OriginFormeDialgaVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Origin Forme Dialga V';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 280;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Metal Blast',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'This attack does 40 more damage for each [M] Energy attached to this Pokémon.'
            },
            {
                name: 'Star Chronos',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 220,
                text: 'Take another turn after this one. (Skip Pokémon Checkup.) (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
        this.set = 'ASR';
        this.set2 = 'astralradiance';
        this.setNumber = '114';
        this.name = 'Origin Forme Dialga VSTAR';
        this.fullName = 'Origin Forme Dialga VSTAR ASR';
        this.VSTAR_MARKER = 'VSTAR_MARKER';
        this.STAR_CHRONOS_MARKER = 'STAR_CHRONOS_MARKER';
        this.STAR_CHRONOS_MARKER_2 = 'STAR_CHRONOS_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            effect.player.marker.removeMarker(this.VSTAR_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.STAR_CHRONOS_MARKER_2, this)) {
            effect.player.marker.removeMarker(this.STAR_CHRONOS_MARKER, this);
            effect.player.marker.removeMarker(this.STAR_CHRONOS_MARKER_2, this);
            effect.player.usedTurnSkip = false;
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.STAR_CHRONOS_MARKER, this)) {
            effect.player.marker.addMarker(this.STAR_CHRONOS_MARKER_2, this);
            console.log('marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.METAL;
                }).length;
            });
            effect.damage += energyCount * 40;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            if (effect.player.marker.hasMarker(this.VSTAR_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            effect.player.marker.addMarker(this.VSTAR_MARKER, this);
            effect.player.marker.addMarker(this.STAR_CHRONOS_MARKER, this);
            effect.player.usedTurnSkip = true;
        }
        return state;
    }
}
exports.OriginFormeDialgaVSTAR = OriginFormeDialgaVSTAR;
