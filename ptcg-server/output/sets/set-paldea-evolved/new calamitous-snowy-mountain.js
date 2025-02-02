"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalamitousSnowyMountain = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class CalamitousSnowyMountain extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '174';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PAL';
        this.name = 'Calamitous Snowy Mountain PAL';
        this.fullName = 'Calamitous Snowy Mountain PAL';
        this.text = '';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.getPokemons().some(p => p.cardType !== card_types_1.CardType.WATER)) {
            const target = effect.target;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if (player === targetPlayer) {
                const damageEffect = new attack_effects_1.PutDamageEffect(target, 20);
                damageEffect.player = player;
                store.reduceEffect(state, damageEffect);
            }
            if (opponent === targetPlayer) {
                const damageEffect = new attack_effects_1.PutDamageEffect(target, 20);
                damageEffect.player = player;
                store.reduceEffect(state, damageEffect);
            }
        }
        return state;
    }
}
exports.CalamitousSnowyMountain = CalamitousSnowyMountain;
