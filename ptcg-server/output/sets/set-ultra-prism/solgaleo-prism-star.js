"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolgaleoPS = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class SolgaleoPS extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Radiant Star',
                cost: [card_types_1.CardType.METAL],
                damage: 0,
                text: 'For each of your opponent\'s Pokémon in play, attach a [M] Energy card from your discard pile to your Pokémon in any way you like.'
            },
            {
                name: 'Corona Impact',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.METAL],
                damage: 160,
                text: 'This Pokémon can\'t attack during your next turn.'
            },
        ];
        this.set = 'SSH';
        this.name = 'Solgaleo Prism Star';
        this.fullName = 'Solgaleo Prism Star FLI';
        // for preventing the pokemon from attacking on the next turn
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Radiant Star
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.name === 'Metal Energy';
            });
            if (!hasEnergyInDiscard) {
                return state;
            }
            const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (benched === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: benched }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        // Corona Impact
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
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
exports.SolgaleoPS = SolgaleoPS;
