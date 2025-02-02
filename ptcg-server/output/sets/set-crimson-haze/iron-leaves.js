"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronLeaves = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class IronLeaves extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.FUTURE];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Recovery Net',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Choose up to 2 Pokémon from your discard pile, reveal them, and put them into your hand.'
            },
            {
                name: 'Vengeful Edge',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, +60 damage.'
            }
        ];
        this.set = 'SV5a';
        this.name = 'Iron Leaves';
        this.fullName = 'Iron Leaves SV5a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.VENGEFUL_EDGE_MARKER = 'VENGEFUL_EDGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const pokemonCount = player.discard.cards.filter(c => {
                return c instanceof pokemon_card_1.PokemonCard;
            }).length;
            if (pokemonCount === 0) {
                return state;
            }
            const max = Math.min(2, pokemonCount);
            return store.prompt(state, [
                new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max, allowCancel: false })
            ], selected => {
                const cards = selected || [];
                player.discard.moveCardsTo(cards, player.hand);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.VENGEFUL_EDGE_MARKER)) {
                effect.damage += 60;
            }
            return state;
        }
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                effect.player.marker.addMarker(this.VENGEFUL_EDGE_MARKER, this);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.VENGEFUL_EDGE_MARKER);
        }
        return state;
    }
}
exports.IronLeaves = IronLeaves;
