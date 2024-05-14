"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamagePump = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class DamagePump extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
        this.regulationMark = 'F';
        this.name = 'Damage Pump';
        this.fullName = 'Damage Pump LOR';
        this.text = 'Move up to 2 damage counters from 1 of your Pokémon to your other Pokémon in any way you like.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const maxAllowedDamage = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            return store.prompt(state, new game_1.MoveDamagePrompt(effect.player.id, game_1.GameMessage.MOVE_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], maxAllowedDamage, { min: 1, max: 2, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    if (source.damage >= 10) {
                        source.damage -= 20;
                        target.damage += 20;
                    }
                    player.supporter.moveCardTo(this, player.discard);
                    return state;
                }
                return state;
            });
        }
        return state;
    }
}
exports.DamagePump = DamagePump;
