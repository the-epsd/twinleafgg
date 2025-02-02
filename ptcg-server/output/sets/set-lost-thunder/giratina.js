"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Giratina = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Giratina extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Distortion Door',
                useFromDiscard: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is in your discard pile, you may put it onto your Bench. If you do, put 1 damage counter on 2 of your opponent\'s Benched Pokémon.'
            }];
        this.attacks = [{
                name: 'Shadow Impact',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: 'Put 4 damage counters on 1 of your Pokémon. '
            }];
        this.set = 'LOT';
        this.setNumber = '97';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Giratina';
        this.fullName = 'Giratina LOT';
        this.DISTORTION_DOOR_MARKER = 'DISTORTION_DOOR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.DISTORTION_DOOR_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            //const opponent = StateUtils.getOpponent(state, player);
            const slots = player.bench.filter(b => b.cards.length === 0);
            console.log('Number of bench slots open: ' + slots.length);
            // Check if card is in the discard
            if (!player.discard.cards.includes(this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Power already used
            if (player.marker.hasMarker(this.DISTORTION_DOOR_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // No open slots, throw error
            if (slots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            // Add Marker
            player.marker.addMarker(this.DISTORTION_DOOR_MARKER, this);
            const cards = player.discard.cards.filter(c => c === this);
            cards.forEach(card => {
                player.discard.moveCardTo(card, slots[0]); // Move to Bench
            });
            if (!hasBench) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 2, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    target.damage += 10;
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, 40);
                    putCountersEffect.target = target;
                    store.reduceEffect(state, putCountersEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Giratina = Giratina;
