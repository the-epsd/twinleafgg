"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gloria = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Gloria extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '141';
        this.regulationMark = 'E';
        this.name = 'Gloria';
        this.fullName = 'Gloria BRS';
        this.text = 'Search your deck for up to 3 Basic Pokémon that don\'t have a Rule Box and put them onto your Bench. Then, shuffle your deck. (Pokémon V, Pokémon-GX, etc. have Rule Boxes.)';
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
                    if (c instanceof game_1.PokemonCard && c.stage === card_types_1.Stage.BASIC &&
                        !c.tags.includes(card_types_1.CardTag.POKEMON_V) &&
                        !c.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) &&
                        !c.tags.includes(card_types_1.CardTag.POKEMON_VMAX) &&
                        !c.tags.includes(card_types_1.CardTag.POKEMON_EX) &&
                        !c.tags.includes(card_types_1.CardTag.POKEMON_GX) &&
                        !c.tags.includes(card_types_1.CardTag.POKEMON_LV_X) &&
                        !c.tags.includes(card_types_1.CardTag.POKEMON_ex) &&
                        // eslint-disable-next-line no-empty
                        !c.tags.includes(card_types_1.CardTag.RADIANT)) {
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
exports.Gloria = Gloria;
