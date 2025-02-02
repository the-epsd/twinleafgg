"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElesasSparkle = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class ElesasSparkle extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '233';
        this.name = 'Elesa\'s Sparkle';
        this.fullName = 'Elesa\'s Sparkle FST';
        this.text = '';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const blocked2 = [];
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(card_types_1.CardTag.FUSION_STRIKE)) {
                    blocked2.push(target);
                }
            });
            // return store.prompt(state, new ChoosePokemonPrompt(
            //   player.id,
            //   GameMessage.ATTACH_ENERGY_TO_BENCH,
            //   PlayerType.BOTTOM_PLAYER,
            //   [SlotType.BENCH, SlotType.ACTIVE],
            //   { min: 0, max: 2, blocked: blocked2 }
            // ), chosen => {
            //   chosen.forEach(target => {
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.deck, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH, play_card_action_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, name: 'Fusion Strike Energy' }, { allowCancel: false, min: 0, max: 2, blockedTo: blocked2, differentTargets: true }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.ElesasSparkle = ElesasSparkle;
