"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dunsparce = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Dunsparce extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Mysterious Nest',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'C Pokémon in play (both yours and your opponent\'s) have no Weakness.'
            }];
        this.attacks = [
            {
                name: 'Rollout',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }
        ];
        this.regulationMark = 'E';
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '207';
        this.name = 'Dunsparce';
        this.fullName = 'Dunsparce FST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let hasDunsparceInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasDunsparceInPlay = true;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasDunsparceInPlay = true;
                }
            });
            if (!hasDunsparceInPlay) {
                return state;
            }
            if (hasDunsparceInPlay) {
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: pokemon_types_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    state = store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                [player, opponent].forEach(p => {
                    p.forEachPokemon(p === player ? game_1.PlayerType.BOTTOM_PLAYER : game_1.PlayerType.TOP_PLAYER, cardList => {
                        var _a;
                        if (((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === card_types_1.CardType.COLORLESS) {
                            effect.weakness = [];
                        }
                    });
                });
            }
        }
        return state;
    }
}
exports.Dunsparce = Dunsparce;
