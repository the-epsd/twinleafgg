"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamBall = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_message_1 = require("../../game/game-message");
class DreamBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'E';
        this.set = 'EVS';
        this.setNumber = '146';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dream Ball';
        this.fullName = 'Dream Ball EVS';
        this.text = 'You can play this card only if you took it as a face-down Prize card, before you put it into your hand. ' +
            `
    ` +
            'Search your deck for a Pokémon and put it onto your Bench. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        // Only act when this card is drawn as a Prize.
        if (effect instanceof game_effects_1.DrawPrizesEffect) {
            const generator = this.handlePrizeEffect(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
    *handlePrizeEffect(next, store, state, effect) {
        const player = effect.player;
        const prizeCard = effect.prizes.find(cardList => cardList.cards.includes(this));
        // Check if play conditions are met
        if (!prizeCard || prefabs_1.GET_PLAYER_BENCH_SLOTS(player).length === 0 || !prizeCard.isSecret || effect.destination !== player.hand) {
            return state;
        }
        // Prevent prize card from going to hand until we complete the card effect flow
        effect.preventDefault = true;
        // Ask player if they want to use the card
        let wantToUse = false;
        yield prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
            wantToUse = result;
            next();
        }, game_message_1.GameMessage.WANT_TO_USE_ITEM_FROM_PRIZES);
        // If the player declines, move the original prize card to hand
        if (!wantToUse) {
            effect.preventDefault = false;
            const prizeIndex = player.prizes.findIndex(prize => prize.cards.includes(this));
            if (prizeIndex !== -1) {
                prefabs_1.TAKE_SPECIFIC_PRIZES(store, state, player, [player.prizes[prizeIndex]], { skipReduce: true });
            }
            return state;
        }
        // If the player agrees, discard Dream Ball
        // (Unfortunately, we have to check this again closer to the end of the flow
        // because due to how the generator pattern works, the player could have
        // played another card to the bench)
        for (const [index, prize] of player.prizes.entries()) {
            if (prize.cards.includes(this)) {
                player.prizes[index].moveTo(player.discard);
                break;
            }
        }
        // Search for a Pokémon and put it onto the bench
        const emptyBenchSlots = prefabs_1.GET_PLAYER_BENCH_SLOTS(player);
        if (emptyBenchSlots.length === 0) {
            return state;
        }
        // Can't search for Pokémon with specific "coming into play" rules
        const searchBlocked = [];
        player.deck.cards.forEach((card, index) => {
            if (card instanceof game_1.PokemonCard && (card.tags.includes(card_types_1.CardTag.POKEMON_LV_X) ||
                card.tags.includes(card_types_1.CardTag.LEGEND) ||
                card.tags.includes(card_types_1.CardTag.BREAK) ||
                card.tags.includes(card_types_1.CardTag.POKEMON_VUNION))) {
                searchBlocked.push(index);
            }
        });
        yield prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, {}, { min: 1, max: 1, allowCancel: false, blocked: searchBlocked });
        return state;
    }
}
exports.DreamBall = DreamBall;
