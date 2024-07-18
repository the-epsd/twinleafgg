"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagSwitch = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    // Player has no Basic Energy in play
    let hasEnergy = false;
    let tagTeamPokemonCount = 0;
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.tags.includes(card_types_1.CardTag.TAG_TEAM)) {
            tagTeamPokemonCount++;
            const energyAttached = cardList.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            hasEnergy = hasEnergy || energyAttached;
        }
    });
    if (!hasEnergy || tagTeamPokemonCount <= 1) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const blockedFrom = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (!card.tags.includes(card_types_1.CardTag.TAG_TEAM)) {
            blockedFrom.push(target);
            return;
        }
    });
    let transfers = [];
    yield store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 2, allowCancel: false, blockedFrom }), result => {
        transfers = result || [];
        next();
    });
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    transfers.forEach(transfer => {
        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
        source.moveCardTo(transfer.card, target);
    });
    return state;
}
class TagSwitch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '209';
        this.name = 'Tag Switch';
        this.fullName = 'Tag Switch UNM';
        this.text = 'Move up to 2 Energy from 1 of your TAG TEAM Pokémon to another of your Pokémon. ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TagSwitch = TagSwitch;
