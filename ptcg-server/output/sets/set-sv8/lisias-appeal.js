"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LisiasAppeal = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const hasBench = opponent.bench.some(b => b.cards.length > 0);
    const supporterTurn = player.supporterTurn;
    if (!hasBench) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card instanceof game_1.PokemonCard && card.stage !== card_types_1.Stage.BASIC) {
            blocked.push();
        }
    });
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, blocked: blocked }), result => {
        const cardList = result[0];
        try {
            const supporterEffect = new play_card_effects_1.SupporterEffect(player, effect.trainerCard);
            store.reduceEffect(state, supporterEffect);
        }
        catch (_a) {
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        opponent.switchPokemon(cardList);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        opponent.active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        return state;
    });
}
class LisiasAppeal extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SV8';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Lisia\'s Appeal';
        this.fullName = 'Lisia\'s Appeal SV8';
        this.text = 'Switch in 1 of your opponent\'s Benched Basic Pokémon to the Active Spot. The new Active Pokémon is now Confused.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.LisiasAppeal = LisiasAppeal;
