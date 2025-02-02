"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plumeria = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    if (player.supporterTurn > 0) {
        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    let cardsInHand = [];
    cardsInHand = player.hand.cards.filter(c => c !== effect.trainerCard);
    if (cardsInHand.length < 2) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let hasPokemonWithEnergy = false;
    const blocked = [];
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
            hasPokemonWithEnergy = true;
        }
        else {
            blocked.push(target);
        }
    });
    if (!hasPokemonWithEnergy) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    const handTemp = new game_1.CardList();
    handTemp.cards = player.hand.cards.filter(c => c !== self);
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 2, max: 2, allowCancel: false }), selected => {
        cardsInHand = selected || [];
        next();
    });
    // Operation canceled by the user
    if (cardsInHand.length === 0) {
        return state;
    }
    player.hand.moveCardsTo(cardsInHand, player.discard);
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    const cardList = targets[0];
    if (cardList.stage == card_types_1.Stage.BASIC) {
        try {
            const supporterEffect = new play_card_effects_1.SupporterEffect(player, effect.trainerCard);
            store.reduceEffect(state, supporterEffect);
        }
        catch (_a) {
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
    }
    const target = targets[0];
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected;
        next();
    });
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    target.moveCardsTo(cards, opponent.discard);
    return state;
}
class Plumeria extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'BUS';
        this.name = 'Plumeria';
        this.fullName = 'Plumeria BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.text = 'Discard 2 cards from your hand. If you do, discard an Energy from 1 of your opponent\'s Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Plumeria = Plumeria;
