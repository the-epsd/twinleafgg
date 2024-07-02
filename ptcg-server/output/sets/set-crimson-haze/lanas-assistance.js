"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanasAssistance = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
function* playCard(next, store, state, self, effect) {
    const player = effect.player;
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    let pokemonsOrEnergyInDiscard = 0;
    const blocked = [];
    player.discard.cards.forEach((c, index) => {
        const isPokemon = c instanceof game_1.PokemonCard && !c.tags.includes(card_types_1.CardTag.POKEMON_ex || card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_VSTAR);
        const isBasicEnergy = c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
        if (isPokemon || isBasicEnergy) {
            pokemonsOrEnergyInDiscard += 1;
        }
        else {
            blocked.push(index);
        }
    });
    // Player does not have correct cards in discard
    if (pokemonsOrEnergyInDiscard === 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 1, max: 3, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    player.discard.moveCardsTo(cards, player.hand);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    
}
class LanasAssistance extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SV5a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'Lana\'s Assistance';
        this.fullName = 'Lana\'s Assistance SV5a';
        this.text = 'Put up to 3 in any combination of Pokémon that don\'t have a Rule Box and Basic Energy cards from your discard pile into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.LanasAssistance = LanasAssistance;
