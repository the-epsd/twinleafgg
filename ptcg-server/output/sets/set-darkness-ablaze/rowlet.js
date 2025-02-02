"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rowlet = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Rowlet extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Sky Circus',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you played Bird Keeper from your hand during this turn, ignore all Energy in this Pokemon\'s attack costs.',
            }
        ];
        this.attacks = [
            {
                name: 'Wind Shard',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 60 damage to 1 of your opponent\'s Benched Pokemon. ' +
                    '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            }
        ];
        this.regulationMark = 'D';
        this.set = 'DAA';
        this.setNumber = '11';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Rowlet';
        this.fullName = 'Rowlet DAA';
        this.ROWLET_SKY_CIRCUS_MARKER = 'ROWLET_SKY_CIRCUS_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Sky Circus
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard.name == 'Bird Keeper') {
            // Put a "played Bird Keeper this turn" marker on ourselves.
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            effect.player.marker.addMarker(this.ROWLET_SKY_CIRCUS_MARKER, effect.trainerCard);
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.marker.hasMarker(this.ROWLET_SKY_CIRCUS_MARKER)) {
            // If we have the marker, the attack cost will be free.
            effect.cost = [];
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ROWLET_SKY_CIRCUS_MARKER, this)) {
            // Remove marker at the end of turn.
            effect.player.marker.removeMarker(this.ROWLET_SKY_CIRCUS_MARKER);
        }
        // Wind Shard
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Can't use the attack if opponent has no bench.
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            // Choose a benched pokemon and then put 60 damage on it.
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Rowlet = Rowlet;
