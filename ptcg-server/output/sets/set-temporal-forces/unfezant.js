"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unfezant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Unfezant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Tranquill';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Opposing Winds',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'You may put 2 Energy attached to your opponent\'s Active Pokémon into their hand.'
            },
            {
                name: 'Boundless Power',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'TEF';
        this.setNumber = '135';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Unfezant';
        this.fullName = 'Unfezant TEF';
        // for preventing the pokemon from attacking on the next turn
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Opposing Winds
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 2, allowCancel: false }), selected => {
                cards = selected || [];
                opponent.active.moveCardsTo(cards, opponent.hand);
            });
        }
        // Boundless Power
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        // removing the markers for preventing the pokemon from attacking
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        return state;
    }
}
exports.Unfezant = Unfezant;
