"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empoleon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_error_1 = require("../../game/game-error");
const __1 = require("../..");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Empoleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Prinplup';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Emergency Surfacing',
                useFromDiscard: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in your discard pile and you have no cards in your hand, you may put this Pokémon onto your Bench. If you do, draw 3 cards.'
            }];
        this.attacks = [{
                name: 'Water Arrow',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'This attack does 60 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Empoleon';
        this.fullName = 'Empoleon BRS';
        this.EMERGENCY_SURFACING_MARKER = 'EMERGENCY_SURFACING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            // Check if card is in the discard
            if (!player.discard.cards.includes(this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            // Power already used
            if (player.marker.hasMarker(this.EMERGENCY_SURFACING_MARKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            // No open slots, throw error
            if (slots.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (player.hand.cards.length !== 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            // Add Marker
            player.marker.addMarker(this.EMERGENCY_SURFACING_MARKER, this);
            const cards = player.discard.cards.filter(c => c === this);
            cards.forEach(card => {
                player.discard.moveCardTo(card, slots[0]); // Move to Bench
                player.deck.moveTo(player.hand, 3); // Move 3 Cards to Hand
            });
            if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.EMERGENCY_SURFACING_MARKER, this)) {
                effect.player.marker.removeMarker(this.EMERGENCY_SURFACING_MARKER, this);
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new __1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, __1.PlayerType.TOP_PLAYER, [__1.SlotType.ACTIVE, __1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Empoleon = Empoleon;
