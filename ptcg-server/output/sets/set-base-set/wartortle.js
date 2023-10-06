"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wartortle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Wartortle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Squirtle';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Withdraw',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, prevent all damage done to Wartortle during your opponent\'s next turn. (Any other effects of attacks still happen.)'
            }, {
                name: 'Bite',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }];
        this.set = 'BS';
        this.name = 'Wartortle';
        this.fullName = 'Wartortle BS';
        this.CLEAR_DEFENSE_CURL_MARKER = 'CLEAR_DEFENSE_CURL_MARKER';
        this.DEFENSE_CURL_MARKER = 'DEFENSE_CURL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    player.active.marker.addMarker(this.DEFENSE_CURL_MARKER, this);
                    opponent.marker.addMarker(this.CLEAR_DEFENSE_CURL_MARKER, this);
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.DEFENSE_CURL_MARKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_DEFENSE_CURL_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_DEFENSE_CURL_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.DEFENSE_CURL_MARKER, this);
            });
        }
        return state;
    }
}
exports.Wartortle = Wartortle;
