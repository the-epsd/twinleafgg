"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReverseValley = void 0;
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
class ReverseValley extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Reverse Valley';
        this.fullName = 'Reverse Valley BKP';
        this.text = 'Choose which way this card faces before you play it. The attacks of this â†“ player\'s [D] Pokémon do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).' +
            '' +
            'Choose which way this card faces before you play it. Any damage done to this â†“ player\'s [M] Pokémon by an opponent\'s attack is reduced by 10 (after applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
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
        if (effect instanceof attack_effects_1.PutDamageEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const stadiumCardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, stadiumCardList);
            const checkDefenderType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkDefenderType);
            // attacking against metal direction down
            if (checkDefenderType.cardTypes.includes(card_types_1.CardType.METAL) && game_1.StadiumDirection.UP &&
                owner !== effect.player) {
                effect.damage = Math.max(0, effect.damage - 10);
                effect.damageReduced = true;
            }
            if (checkDefenderType.cardTypes.includes(card_types_1.CardType.METAL) && game_1.StadiumDirection.DOWN &&
                owner === effect.player) {
                effect.damage = Math.max(0, effect.damage - 10);
                effect.damageReduced = true;
            }
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const stadiumCardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, stadiumCardList);
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.DARK) && game_1.StadiumDirection.UP &&
                effect.damage > 0 && effect.target === opponent.active && owner === effect.player) {
                effect.damage += 10;
            }
            if (game_1.StadiumDirection.DOWN && owner !== player &&
                checkPokemonType.cardTypes.includes(card_types_1.CardType.DARK) && effect.target === opponent.active) {
                effect.damage += 10;
            }
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.ReverseValley = ReverseValley;
