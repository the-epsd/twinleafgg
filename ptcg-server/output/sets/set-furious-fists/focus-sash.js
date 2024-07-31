"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusSash = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_1 = require("../../game/store/state/state");
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
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.tool === this) {
            const player = effect.player;
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            const cardList = game_1.StateUtils.findCardList(state, this);
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(cardList);
            if (effect.damage <= 0 || player === targetPlayer || !checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.FIGHTING)) {
                return state;
            }
            const maxHp = effect.target.hp;
            console.log('maxHp = ' + maxHp);
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            if (state.phase === state_1.GamePhase.ATTACK) {
                if (effect.target.damage === 0) {
                    if (effect.damage >= maxHp) {
                        effect.damage = 0;
                        effect.target.damage = effect.target.hp - 10;
                        console.log('effect.target.hp - 10 = ' + (effect.target.hp - 10));
                        cardList.moveCardTo(this, targetPlayer.discard);
                        cardList.tool = undefined;
                    }
                }
            }
            return state;
        }
        return state;
    }
}
exports.FocusSash = FocusSash;
