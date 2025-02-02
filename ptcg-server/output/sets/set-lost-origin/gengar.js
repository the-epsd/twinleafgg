"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_error_1 = require("../../game/game-error");
const __1 = require("../..");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Gengar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Haunter';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Netherworld Gate',
                useFromDiscard: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in your discard pile, you may put it onto your Bench. If you do, put 3 damage counters on this Pokémon.'
            }];
        this.attacks = [{
                name: 'Screaming Circle',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Put 2 damage counters on your opponent\'s Active Pokémon for each of your opponent\'s Benched Pokémon.'
            }];
        this.regulationMark = 'G';
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Gengar';
        this.fullName = 'Gengar LOR';
        this.NETHERWORLD_GATE_MARKER = 'NETHERWORLD_GATE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            console.log('Number of bench slots open: ' + slots.length);
            // Check if card is in the discard
            if (!player.discard.cards.includes(this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            // Power already used
            if (player.marker.hasMarker(this.NETHERWORLD_GATE_MARKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            // No open slots, throw error
            if (slots.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Add Marker
            player.marker.addMarker(this.NETHERWORLD_GATE_MARKER, this);
            const cards = player.discard.cards.filter(c => c === this);
            cards.forEach((card, index) => {
                player.discard.moveCardTo(card, slots[index]);
                slots[index].damage += 30; // Add 30 damage
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.NETHERWORLD_GATE_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const damageEffect = new attack_effects_1.PutCountersEffect(effect, opponentBenched * 20);
            return store.reduceEffect(state, damageEffect);
        }
        return state;
    }
}
exports.Gengar = Gengar;
