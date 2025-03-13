"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolScrapper = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let pokemonsWithTool = 0;
    const blocked = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.tool !== undefined) {
            pokemonsWithTool += 1;
        }
        else {
            blocked.push(target);
        }
    });
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.tool !== undefined) {
            pokemonsWithTool += 1;
        }
        else {
            blocked.push(target);
        }
    });
    if (pokemonsWithTool === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const max = Math.min(2, pokemonsWithTool);
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: true, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    // Discard trainer only when user selected a Pokemon
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    targets.forEach(target => {
        const owner = game_1.StateUtils.findOwner(state, target);
        if (target.tool !== undefined) {
            target.moveCardTo(target.tool, owner.discard);
            target.tool = undefined;
        }
    });
    return state;
}
class ToolScrapper extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DRX';
        this.name = 'Tool Scrapper';
        this.fullName = 'Tool Scrapper DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.text = 'Choose up to 2 Pokemon Tool cards attached to Pokemon in play (yours or ' +
            'your opponent\'s) and discard them.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.ToolScrapper = ToolScrapper;
