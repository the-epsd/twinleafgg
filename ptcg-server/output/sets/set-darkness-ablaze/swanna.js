"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swanna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* useFeatherSlice(next, store, state, effect) {
    const player = effect.player;
    // If our hand is empty, don't give a discard prompt.
    if (player.hand.cards.length == 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    // If we decided not to discard, just do 70 damage.
    if (cards.length === 0) {
        return state;
    }
    // Else, discard the card and do 140 damage.
    player.hand.moveCardsTo(cards, player.discard);
    effect.damage += 70;
    return state;
}
class Swanna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ducklett';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.powers = [
            {
                name: 'Sky Circus',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you played Bird Keeper from your hand during this turn, ignore all Energy in this Pokemon\'s attack costs.',
            }
        ];
        this.attacks = [
            {
                name: 'Feather Slice',
                cost: [C, C, C],
                damage: 70,
                text: 'You may discard a card from your hand. If you do, this attack does 70 more damage.',
            }
        ];
        this.regulationMark = 'D';
        this.set = 'DAA';
        this.setNumber = '149';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Swanna';
        this.fullName = 'Swanna DAA';
        this.SWANNA_SKY_CIRCUS_MARKER = 'SWANNA_SKY_CIRCUS_MARKER';
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
            effect.player.marker.addMarker(this.SWANNA_SKY_CIRCUS_MARKER, effect.trainerCard);
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.player.marker.hasMarker(this.SWANNA_SKY_CIRCUS_MARKER)) {
            // If we have the marker, the attack cost will be free.
            effect.cost = [];
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SWANNA_SKY_CIRCUS_MARKER, this)) {
            // Remove marker at the end of turn.
            effect.player.marker.removeMarker(this.SWANNA_SKY_CIRCUS_MARKER);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useFeatherSlice(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Swanna = Swanna;
