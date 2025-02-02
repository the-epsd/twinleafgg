"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brigette = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Brigette extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '134';
        this.regulationMark = 'E';
        this.name = 'Brigette';
        this.fullName = 'Brigette BKT';
        this.text = 'Search your deck for 1 Basic Pokémon-EX or 3 Basic Pokémon (except for Pokémon-EX) and put them onto your Bench. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            // Allow player to search deck and choose up to 2 Basic Pokemon
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            else {
                // Check if bench has open slots
                const openSlots = player.bench.filter(b => b.cards.length === 0);
                if (openSlots.length === 0) {
                    // No open slots, throw error
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
                const blocked = [];
                player.deck.cards.forEach((c, index) => {
                    // eslint-disable-next-line no-empty
                    if (c instanceof game_1.PokemonCard && c.stage === card_types_1.Stage.BASIC && !c.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                    }
                    else {
                        blocked.push(index);
                    }
                });
                player.hand.moveCardTo(effect.trainerCard, player.supporter);
                // We will discard this card after prompt confirmation
                effect.preventDefault = true;
                let cards = [];
                const maxCards = Math.min(3, openSlots.length);
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: maxCards, allowCancel: false }), selectedCards => {
                    cards = selectedCards || [];
                    cards.forEach((card, index) => {
                        player.deck.moveCardTo(card, slots[index]);
                        slots[index].pokemonPlayedTurn = state.turn;
                    });
                    player.supporter.moveCardTo(this, player.discard);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            }
        }
        return state;
    }
}
exports.Brigette = Brigette;
