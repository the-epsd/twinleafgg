"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mantine = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class Mantine extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Borne Ashore',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put a Basic Pokémon from either player\'s discard pile onto that player\'s Bench.'
            },
            {
                name: 'Aqua Edge',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }
        ];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Mantine';
        this.fullName = 'Mantine ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const slots = opponent.bench.filter(b => b.cards.length === 0);
            if (opponent.discard.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if bench has open slots
            const openSlots = opponent.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                // No open slots, throw error
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, opponent.discard || player.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: true }), selected => {
                cards = selected || [];
            });
            // Operation canceled by the user
            if (cards.length === 0) {
                return state;
            }
            cards.forEach((card, index) => {
                if (opponent.discard) {
                    opponent.discard.moveCardTo(card, slots[index]);
                }
                else {
                    player.discard.moveCardTo(card, slots[index]);
                }
                slots[index].pokemonPlayedTurn = state.turn;
            });
        }
        return state;
    }
}
exports.Mantine = Mantine;
