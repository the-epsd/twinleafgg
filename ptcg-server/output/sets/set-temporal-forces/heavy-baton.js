"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeavyBaton = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class HeavyBaton extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'PAR';
        this.name = 'Heavy Baton';
        this.fullName = 'Heavy Baton PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.text = 'If the Pokémon this card is attached to has a Retreat Cost of exactly 4, is in the Active Spot, and is Knocked Out by damage from an attack from your opponent\'s Pokémon, move up to 3 Basic Energy cards from that Pokémon to your Benched Pokémon in any way you like.';
        this.RESCUE_SCARF_MAREKER = 'RESCUE_SCARF_MAREKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBench = player.bench.some(b => b.cards.length > 0);
            //   const energyList = new CardList();
            // Get attached energy cards
            const attachedEnergies = effect.target.cards.filter(card => {
                return card instanceof game_1.EnergyCard;
            });
            //   attachedEnergies.forEach(energy => {
            //     energy.cards.moveTo(energyList);
            //   });
            //   const retreatCost = effect.target.getPokemonCard()?.retreat;
            //   if (retreatCost && retreatCost.length === 4 && retreatCost.every(cost => cost === CardType.COLORLESS)) {
            //     // Retreat cost is 4 colorless energy
            //   }
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== state_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            if (hasBench === false) {
                return state;
            }
            const target = effect.target;
            const cards = target.getPokemons();
            cards.forEach(card => {
                attachedEnergies.forEach(energyCard => this.marker.addMarker(this.RESCUE_SCARF_MAREKER, card));
            });
            if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
                state.players.forEach(player => {
                    if (!player.marker.hasMarker(this.RESCUE_SCARF_MAREKER)) {
                        return;
                    }
                    const rescued = player.marker.markers
                        .filter(m => m.name === this.RESCUE_SCARF_MAREKER)
                        .map(m => m.source);
                    player.discard.moveCardsTo(rescued, player.hand);
                    player.marker.removeMarker(this.RESCUE_SCARF_MAREKER);
                });
            }
            return state;
        }
        return state;
    }
}
exports.HeavyBaton = HeavyBaton;
//   return store.prompt(state, new AttachEnergyPrompt(
//     player.id,
//     GameMessage.ATTACH_ENERGY_TO_BENCH,
//     energyList,
//     PlayerType.BOTTOM_PLAYER,
//     [ SlotType.BENCH ],
//     { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
//     { allowCancel: false, min: 0, max: 3 }
//   ), transfers => {
//     transfers = transfers || [];
//     for (const transfer of transfers) {
//       const target = StateUtils.getTarget(state, player, transfer.to);
//       energyList.moveCardTo(transfer.card, target);
//     }
