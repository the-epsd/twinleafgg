"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CastformSnowyForm = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class CastformSnowyForm extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.resistance = [];
        this.retreat = [];
        this.powers = [
            {
                name: 'Weather Reading',
                text: 'If you have 8 or more Stadium cards in your discard pile, ignore all Energy in this Pokémon\'s attack costs.',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: false,
            }
        ];
        this.attacks = [{
                name: 'Frosty Typhoon',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'During your next turn, this Pokémon can\'t use Frosty Typhoon.'
            }];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Castform Snowy Form';
        this.fullName = 'Castform Snowy Form CRE';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    getColorlessReduction(state) {
        const player = state.players[state.activePlayer];
        const stadiumsInDiscard = player.discard.cards.filter(c => c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM).length;
        return stadiumsInDiscard >= 8 ? 2 : 0;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            const stadiumsInDiscard = player.discard.cards.filter(c => c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM).length;
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (stadiumsInDiscard >= 8) {
                const costToRemove = 3;
                for (let i = 0; i < costToRemove; i++) {
                    let index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                    else {
                        index = effect.cost.indexOf(card_types_1.CardType.WATER);
                        if (index !== -1) {
                            effect.cost.splice(index, 1);
                        }
                    }
                }
            }
        }
        return state;
    }
}
exports.CastformSnowyForm = CastformSnowyForm;
