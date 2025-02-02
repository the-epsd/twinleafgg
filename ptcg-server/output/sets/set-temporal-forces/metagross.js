"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metagross = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Metagross extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Metang';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Meteor Mash',
                cost: [card_types_1.CardType.METAL],
                damage: 60,
                text: 'During your next turn, this Pokémon\'s Meteor Mash attack does 60 more damage (before applying Weakness and Resistance).'
            },
            {
                name: 'Luster Blast',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: 'Discard 2 Energy from this Pokémon.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.name = 'Metagross';
        this.fullName = 'Metagross TEF';
        this.NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
        this.NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';
        this.usedAttack = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect) {
            this.usedAttack = true;
        }
        if (effect instanceof game_phase_effects_1.BeginTurnEffect) {
            if (this.usedAttack) {
                this.usedAttack = false;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (!this.usedAttack) {
                this.usedAttack = false;
                effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
                effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
            effect.player.marker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
            effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
                effect.damage += 60;
            }
            effect.player.marker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
        }
        return state;
    }
}
exports.Metagross = Metagross;
