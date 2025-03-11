"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusSash = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class FocusSash extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'FFI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Focus Sash';
        this.fullName = 'Focus Sash FFI';
        this.text = 'If the [F] Pokémon this card is attached to has full HP and would be Knocked Out by damage from an opponent\'s attack, that Pokémon is not Knocked Out and its remaining HP becomes 10 instead. Then, discard this card.';
        this.canDiscard = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.tools.includes(this) && effect.target.damage == 0) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (prefabs_1.IS_TOOL_BLOCKED(store, state, effect.player, this)) {
                return state;
            }
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
                        prefabs_1.REMOVE_TOOL(store, state, cardList, this, game_1.SlotType.DISCARD);
                    }
                });
            }
        }
        return state;
    }
}
exports.FocusSash = FocusSash;
