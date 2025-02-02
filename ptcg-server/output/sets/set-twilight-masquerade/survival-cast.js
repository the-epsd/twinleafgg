"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurvivalCast = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
// interface PokemonItem {
//   playerNum: number;
//   cardList: PokemonCardList;
// }
class SurvivalCast extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [card_types_1.CardTag.ACE_SPEC];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '164';
        this.name = 'Survival Brace';
        this.fullName = 'Survival Brace TWM';
        this.canDiscard = false;
        this.text = 'If the Pokémon this card is attached to has full HP and would be Knocked Out by damage from an opponent\'s attack, that Pokémon is not Knocked Out and its remaining HP becomes 10 instead. Then, discard this card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.tool === this && effect.target.damage == 0) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const checkHpEffect = new check_effects_1.CheckHpEffect(player, effect.target);
            store.reduceEffect(state, checkHpEffect);
            if (effect.target.damage === 0 && effect.damage >= checkHpEffect.hp) {
                effect.preventDefault = true;
                effect.target.damage = checkHpEffect.hp - 10;
                store.log(state, game_1.GameLog.LOG_PLAYER_PLAYS_TOOL, { card: this.name });
                this.canDiscard = true;
            }
            if (this.canDiscard) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                    if (cardList.cards.includes(this)) {
                        cardList.moveCardTo(this, player.discard);
                        cardList.tool = undefined;
                    }
                });
            }
        }
        return state;
    }
}
exports.SurvivalCast = SurvivalCast;
