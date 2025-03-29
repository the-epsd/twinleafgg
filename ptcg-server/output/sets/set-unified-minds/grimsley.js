"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grimsley = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Grimsley extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '199';
        this.name = 'Grimsley';
        this.fullName = 'Grimsley UNM';
        this.text = 'Move up to 3 damage counters from 1 of your opponent\'s Pokémon to another of their Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            const damagedPokemon = [
                ...opponent.bench.filter(b => b.cards.length > 0 && b.damage > 0),
                ...(opponent.active.damage > 0 ? [opponent.active] : [])
            ];
            if (damagedPokemon.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_MOVE_DAMAGE);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const maxAllowedDamage = [];
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            return store.prompt(state, new game_1.MoveDamagePrompt(effect.player.id, game_message_1.GameMessage.MOVE_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], maxAllowedDamage, { min: 1, max: 3, allowCancel: false, singleSourceTarget: true, singleDestinationTarget: true }), transfers => {
                if (transfers === null) {
                    player.supporter.moveCardTo(this, player.discard);
                    return state;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.damage -= 10;
                    target.damage += 10;
                }
                player.supporter.moveCardTo(this, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.Grimsley = Grimsley;
