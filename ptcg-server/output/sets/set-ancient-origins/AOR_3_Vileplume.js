"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vileplume = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Vileplume extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gloom';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Irritating Pollen',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each player can\'t play any Item cards from his or her hand.'
            }];
        this.attacks = [{
                name: 'Solar Beam',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }];
        this.set = 'AOR';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vileplume';
        this.fullName = 'Vileplume AOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayItemEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let vileplumeInPlay = false;
            // Checking to see if ability is being blocked
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            // Checks for Vileplume in play on Player's Turn
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER && game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    vileplumeInPlay = true;
                }
                if (!vileplumeInPlay) {
                    return state;
                }
                if (vileplumeInPlay) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
            });
            // Checks for Vileplume in play on Opponent's Turn (opponent of the owner of this card)
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER && game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    vileplumeInPlay = true;
                }
                if (!vileplumeInPlay) {
                    return state;
                }
                if (vileplumeInPlay) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
            });
        }
        return state;
    }
}
exports.Vileplume = Vileplume;
