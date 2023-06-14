"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gabite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Gabite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gible';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 80;
        this.weakness = [{
                type: card_types_1.CardType.COLORLESS,
                value: 20
            }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Burrow',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, prevent all damage done to Gabite by ' +
                    'attacks during your opponent\'s next turn.'
            }, {
                name: 'Distorted Wave',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Before doing damage, remove 2 damage counters from the Defending ' +
                    'Pokemon.'
            }];
        this.set = 'OP9';
        this.name = 'Gabite';
        this.fullName = 'Gabite OP9';
        this.CLEAR_BURROW_MARKER = 'CLEAR_DEFENSE_CURL_MARKER';
        this.BURROW_MARKER = 'DEFENSE_CURL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    player.active.marker.addMarker(this.BURROW_MARKER, this);
                    opponent.marker.addMarker(this.CLEAR_BURROW_MARKER, this);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const healTarget = new attack_effects_1.HealTargetEffect(effect, 20);
            return store.reduceEffect(state, healTarget);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.BURROW_MARKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_BURROW_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_BURROW_MARKER, this);
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.BURROW_MARKER, this);
            });
        }
        return state;
    }
}
exports.Gabite = Gabite;
