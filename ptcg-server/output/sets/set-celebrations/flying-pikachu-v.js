"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlyingPikachuV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class FlyingPikachuV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Thunder Shock',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 20,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }, {
                name: 'Fly',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Flip a coin. If tails, this attack does nothing. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
            }];
        this.set = 'CEL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Flying Pikachu V';
        this.fullName = 'Flying Pikachu V CEL';
        this.CLEAR_FLY_MARKER = 'CLEAR_FLY_MARKER';
        this.FLY_MARKER = 'FLY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            state = store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
                if (!flipResult) {
                    // if tails, do nothing
                    effect.damage = 0;
                    return state;
                }
                if (flipResult) {
                    player.active.marker.addMarker(this.FLY_MARKER, this);
                    opponent.marker.addMarker(this.CLEAR_FLY_MARKER, this);
                }
            });
            if (effect instanceof attack_effects_1.AbstractAttackEffect || effect instanceof attack_effects_1.PutDamageEffect
                && effect.target.marker.hasMarker(this.FLY_MARKER)) {
                effect.preventDefault = true;
                return state;
            }
            if (effect instanceof game_phase_effects_1.EndTurnEffect
                && effect.player.marker.hasMarker(this.CLEAR_FLY_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_FLY_MARKER, this);
                const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.FLY_MARKER, this);
                });
            }
            return state;
        }
        return state;
    }
}
exports.FlyingPikachuV = FlyingPikachuV;
