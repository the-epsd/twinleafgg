"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jolteonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const discard_energy_prompt_1 = require("../../game/store/prompts/discard-energy-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Jolteonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = L;
        this.hp = 260;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Flash Spear',
                cost: [L, C],
                damage: 60,
                damageCalculation: '+',
                text: 'You may discard up to 2 Basic Energy from your Benched Pokémon. This attack does 90 more damage for each card discarded this way.'
            },
            {
                name: 'Dravite',
                cost: [R, W, L],
                damage: 280,
                text: 'This Pokémon can\'t attack during your next turn'
            },
        ];
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Jolteon ex';
        this.fullName = 'Jolteon ex SV8a';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            state = store.prompt(state, new discard_energy_prompt_1.DiscardEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], // Card source is target Pokemon
            { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), transfers => {
                if (transfers === null || transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    let totalDiscarded = 0;
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = player.discard;
                    source.moveCardTo(transfer.card, target);
                    totalDiscarded = transfers.length;
                    // Base damage is 60
                    if (totalDiscarded === 0) {
                        effect.damage = 60;
                    }
                    else if (totalDiscarded === 1) {
                        effect.damage = 150; // 60 + 90
                    }
                    else if (totalDiscarded === 2) {
                        effect.damage = 240; // 60 + (90 * 2)
                    }
                }
                console.log('Total Damage: ' + effect.damage);
                return state;
            });
        }
        // Carnelian
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
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
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Jolteonex = Jolteonex;
