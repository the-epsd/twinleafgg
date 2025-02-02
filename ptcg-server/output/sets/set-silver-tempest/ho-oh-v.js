"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoOhV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class HoOhV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 230;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Reviving Flame',
                useFromDiscard: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in your discard pile, you may put it onto your Bench. If you do, attach up to 4 basic Energy cards from your discard pile to this Pokémon. If you use this Ability, your turn ends.',
            }];
        this.attacks = [{
                name: 'Rainbow Burn',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each type of basic Energy attached to this Pokémon.',
            }];
        this.set = 'SIT';
        this.name = 'Ho-Oh V';
        this.fullName = 'Ho-Oh V SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '001';
        this.NETHERWORLD_GATE_MARKER = 'NETHERWORLD_GATE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            console.log('Number of bench slots open: ' + slots.length);
            // Check if card is in the discard
            if (!player.discard.cards.includes(this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Power already used
            if (player.marker.hasMarker(this.NETHERWORLD_GATE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // No open slots, throw error
            if (slots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Add Marker
            player.marker.addMarker(this.NETHERWORLD_GATE_MARKER, this);
            const cards = player.discard.cards.filter(c => c === this);
            cards.forEach((card, index) => {
                player.discard.moveCardTo(card, slots[index]);
            });
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                return state;
            }
            let hasDarkraiGXOnBench = false;
            const blockedTo = [];
            player.bench.forEach((bench, index) => {
                if (bench.cards.length === 0) {
                    return;
                }
                const pokemonCard = bench.getPokemonCard();
                if (pokemonCard instanceof HoOhV) {
                    hasDarkraiGXOnBench = true;
                }
                else {
                    const target = {
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: game_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            if (hasDarkraiGXOnBench) {
                state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 4, blockedTo }), transfers => {
                    transfers = transfers || [];
                    if (transfers.length === 0) {
                        return;
                    }
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.discard.moveCardTo(transfer.card, target);
                    }
                    const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                    store.reduceEffect(state, endTurnEffect);
                    return state;
                });
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.NETHERWORLD_GATE_MARKER, this);
        }
        return state;
    }
}
exports.HoOhV = HoOhV;
