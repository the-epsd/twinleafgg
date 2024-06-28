"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParallelCity = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const state_utils_1 = require("../../game/store/state-utils");
class ParallelCity extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'BKT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '145';
        this.name = 'Parallel City';
        this.fullName = 'Parallel City BKT';
        this.text = 'Choose which way this card faces before you play it. This â†“ player can\'t have more than 3 Benched Pokémon. (When this card comes into play, this â†“ player discards Benched Pokémon until he or she has 3 Pokémon on the Bench.)' +
            '' +
            'Choose which way this card faces before you play it. Any damage done by attacks from this â†“ player\'s [G] [R] or [W] Pokémon is reduced by 20 (after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c, _d, _e, _f;
        if (effect instanceof play_card_effects_1.PlayStadiumEffect && effect.trainerCard === this) {
            const player = effect.player;
            const options = [
                {
                    message: game_message_1.GameMessage.UP,
                    action: () => {
                        const stadiumCard = state_utils_1.StateUtils.getStadiumCard(state);
                        if (stadiumCard !== undefined) {
                            const cardList = state_utils_1.StateUtils.findCardList(state, stadiumCard);
                            cardList.stadiumDirection = game_1.StadiumDirection.UP;
                            return state;
                        }
                    }
                },
                {
                    message: game_message_1.GameMessage.DOWN,
                    action: () => {
                        const stadiumCard = state_utils_1.StateUtils.getStadiumCard(state);
                        if (stadiumCard !== undefined) {
                            const cardList = state_utils_1.StateUtils.findCardList(state, stadiumCard);
                            cardList.stadiumDirection = game_1.StadiumDirection.DOWN;
                            return state;
                        }
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_message_1.GameMessage.WHICH_DIRECTION_TO_PLACE_STADIUM, options.map(c => c.message), { allowCancel: false }), choice => {
                const option = options[choice];
                if (option.action) {
                    option.action();
                }
                return state;
            });
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const stadiumCardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, stadiumCardList);
            const benchSizes = [0, 0];
            if (stadiumCardList.stadiumDirection === game_1.StadiumDirection.UP) {
                state.players.forEach((p, index) => {
                    if (p === owner) {
                        benchSizes[index] = 5;
                    }
                    else {
                        benchSizes[index] = 3;
                    }
                });
                effect.benchSizes = benchSizes;
            }
            if (stadiumCardList.stadiumDirection === game_1.StadiumDirection.DOWN) {
                state.players.forEach((p, index) => {
                    if (p === owner) {
                        benchSizes[index] = 3;
                    }
                    else {
                        benchSizes[index] = 5;
                    }
                });
                effect.benchSizes = benchSizes;
            }
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const stadiumCardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, stadiumCardList);
            if (effect.player === owner && stadiumCardList.stadiumDirection === game_1.StadiumDirection.UP &&
                (((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === card_types_1.CardType.FIRE ||
                    ((_b = effect.player.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.cardType) === card_types_1.CardType.WATER ||
                    ((_c = effect.player.active.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.cardType) === card_types_1.CardType.GRASS)) {
                effect.damage -= 20;
            }
            else if (effect.player !== owner && stadiumCardList.stadiumDirection === game_1.StadiumDirection.DOWN &&
                (((_d = effect.player.active.getPokemonCard()) === null || _d === void 0 ? void 0 : _d.cardType) === card_types_1.CardType.FIRE ||
                    ((_e = effect.player.active.getPokemonCard()) === null || _e === void 0 ? void 0 : _e.cardType) === card_types_1.CardType.WATER ||
                    ((_f = effect.player.active.getPokemonCard()) === null || _f === void 0 ? void 0 : _f.cardType) === card_types_1.CardType.GRASS)) {
                effect.damage -= 20;
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.ParallelCity = ParallelCity;
