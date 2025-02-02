"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuddyBuddyPoffin = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BuddyBuddyPoffin extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
        this.regulationMark = 'H';
        this.name = 'Buddy-Buddy Poffin';
        this.fullName = 'Buddy-Buddy Poffin TEF';
        this.text = 'Search your deck for up to 2 Basic Pokémon with 70 HP or less and put them onto your Bench. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this)) {
            const player = effect.player;
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0 || openSlots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const blocked = player.deck.cards.reduce((acc, c, index) => {
                if (!(c instanceof game_1.PokemonCard && c.stage === card_types_1.Stage.BASIC && c.hp <= 70)) {
                    acc.push(index);
                }
                return acc;
            }, []);
            const maxPokemons = Math.min(openSlots.length, 2);
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: maxPokemons, allowCancel: false, blocked, maxPokemons }), selectedCards => {
                const cards = selectedCards || [];
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, openSlots[index]);
                    openSlots[index].pokemonPlayedTurn = state.turn;
                    store.log(state, game_1.GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, { name: player.name, card: card.name });
                });
                player.supporter.moveCardTo(this, player.discard);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.BuddyBuddyPoffin = BuddyBuddyPoffin;
