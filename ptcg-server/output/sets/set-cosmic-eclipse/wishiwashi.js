"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishiwashi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Wishiwashi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Scatter',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'At the end of your opponent\'s turn, if this Pokémon has any damage counters on it, flip a coin.If tails, shuffle this Pokémon and all cards attached to it into your deck.'
            }];
        this.attacks = [{
                name: 'Hydro Splash',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: ''
            }];
        this.set = 'CEC';
        this.setNumber = '62';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Wishiwashi';
        this.fullName = 'Wishiwashi CEC';
        this.SCATTER_MARKER = 'SCATTER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BeginTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.SCATTER_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && game_1.StateUtils.getOpponent(state, effect.player).marker.hasMarker(this.SCATTER_MARKER, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    if (cardList.damage > 0) {
                        return store.prompt(state, [
                            new game_1.CoinFlipPrompt(opponent.id, game_1.GameMessage.COIN_FLIP)
                        ], result => {
                            if (result === false) {
                                cardList.moveTo(opponent.deck);
                                cardList.clearEffects();
                            }
                        });
                    }
                }
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                opponent.deck.applyOrder(order);
                opponent.marker.removeMarker(this.SCATTER_MARKER, this);
                return state;
            });
        }
        return state;
    }
}
exports.Wishiwashi = Wishiwashi;
