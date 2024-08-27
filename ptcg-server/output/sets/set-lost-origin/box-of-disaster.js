"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoxOfDisaster = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BoxOfDisaster extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '154';
        this.name = 'Box of Disaster';
        this.fullName = 'Box of Disaster LOR';
        this.text = 'If the Pokémon V this card is attached to has full HP and is Knocked Out by damage from an attack from your opponent\'s Pokémon, put 8 damage counters on the Attacking Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.tool === this) {
            const player = effect.player;
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            try {
                const toolEffect = new play_card_effects_1.ToolEffect(player, this);
                store.reduceEffect(state, toolEffect);
            }
            catch (_a) {
                return state;
            }
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
            const vPoke = effect.target.getPokemonCard();
            const activePokemon = player.active;
            const maxHp = activePokemon.hp;
            if (state.phase === state_1.GamePhase.ATTACK) {
                if (vPoke && vPoke.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                    if (maxHp === maxHp && player.active.damage >= maxHp) {
                        effect.source.damage += 80;
                    }
                    return state;
                }
                if (vPoke && vPoke.tags.includes(card_types_1.CardTag.POKEMON_V)) {
                    if (maxHp === maxHp && player.active.damage >= maxHp) {
                        effect.source.damage += 80;
                    }
                    return state;
                }
                if (vPoke && vPoke.tags.includes(card_types_1.CardTag.POKEMON_VSTAR)) {
                    if (maxHp === maxHp && player.active.damage >= maxHp) {
                        effect.source.damage += 80;
                    }
                    return state;
                }
            }
            return state;
        }
        return state;
    }
}
exports.BoxOfDisaster = BoxOfDisaster;
