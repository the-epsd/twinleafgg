"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChillTeaserToy = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
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
    if (state.turn !== 2) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    const target = targets[0];
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, target, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected;
        next();
    });
    target.moveCardsTo(cards, opponent.hand);
    return state;
}
class ChillTeaserToy extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'SSP';
        this.setNumber = '166';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Chill Teaser Toy';
        this.fullName = 'Chill Teaser Toy SSP';
        this.text = 'You can use this card only if you go second, and only during your first turn. \n Put an Energy attached to 1 of your opponent\'s Pokemon into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.ChillTeaserToy = ChillTeaserToy;
