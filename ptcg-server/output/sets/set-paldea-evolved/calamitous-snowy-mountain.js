"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalamitousSnowyMountain = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class CalamitousSnowyMountain extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '174';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'PAL';
        this.name = 'Calamitous Snowy Mountain';
        this.fullName = 'Calamitous Snowy Mountain PAL';
        this.text = 'Whenever any player attaches an Energy card from their hand to 1 of their Basic non-[W] Pokémon, put 2 damage counters on that Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (!effect.target.isStage(card_types_1.Stage.BASIC) || checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.WATER)) {
                return state;
            }
            const owner = game_1.StateUtils.findOwner(state, effect.target);
            store.log(state, game_1.GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, { name: owner.name, damage: 20, target: effect.target.getPokemonCard().name, effect: this.name });
            effect.target.damage += 20;
        }
        return state;
    }
}
exports.CalamitousSnowyMountain = CalamitousSnowyMountain;
