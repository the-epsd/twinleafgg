"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Floatzel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
function* useAquaJet(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    // Opponent doesn't have benched pokemon
    const hasBenched = opponent.bench.some(b => b.cards.length > 0);
    if (!hasBenched) {
        return state;
    }
    let flipResult = false;
    yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), result => {
        flipResult = result;
        next();
    });
    if (!flipResult) {
        return state;
    }
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.BENCH], { allowCancel: false }), targets => {
        if (!targets || targets.length === 0) {
            return;
        }
        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
    });
}
class Floatzel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Buizel';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 80;
        this.weakness = [{
                type: card_types_1.CardType.LIGHTNING,
                value: 20
            }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Agility',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip a coin. If heads, prevent all effects of an attack, ' +
                    'including damage, done to Floatzel during your opponent\'s next turn.'
            }, {
                name: 'Aqua Jet',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Flip a coin. If heads, this attack does 10 damage to 1 ' +
                    'of your opponent\'s Benched Pokemon. (Don\'t apply Weakness ' +
                    'and Resistance for Benched Pokemon.)'
            }];
        this.set = 'DP';
        this.name = 'Floatzel';
        this.fullName = 'Floatzel GE';
        this.CLEAR_AGILITY_MARKER = 'CLEAR_AGILITY_MARKER';
        this.AGILITY_MARKER = 'AGILITY_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            state = store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    player.active.marker.addMarker(this.AGILITY_MARKER, this);
                    opponent.marker.addMarker(this.CLEAR_AGILITY_MARKER, this);
                }
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = useAquaJet(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect
            && effect.target.marker.hasMarker(this.AGILITY_MARKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_AGILITY_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_AGILITY_MARKER, this);
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.AGILITY_MARKER, this);
            });
        }
        return state;
    }
}
exports.Floatzel = Floatzel;
