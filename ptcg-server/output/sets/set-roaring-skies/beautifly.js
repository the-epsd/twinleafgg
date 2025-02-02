"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beautifly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const confirm_prompt_1 = require("../../game/store/prompts/confirm-prompt");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
function* useWhirlwind(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const opponentHasBenched = opponent.bench.some(b => b.cards.length > 0);
    if (!opponentHasBenched) {
        return state;
    }
    let wantToUse = false;
    yield store.prompt(state, new confirm_prompt_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_SWITCH_POKEMON), result => {
        wantToUse = result;
        next();
    });
    if (!wantToUse) {
        return state;
    }
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.BENCH], { allowCancel: false }), selected => {
        if (!selected || selected.length === 0) {
            return state;
        }
        const target = selected[0];
        opponent.switchPokemon(target);
        next();
    });
    return state;
}
class Beautifly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Silcoon';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [];
        this.powers = [{
                name: 'Miraculous Scales',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to this Pokemon by attacks from your ' +
                    'opponent\'s Pokemon-EX.'
            }];
        this.attacks = [{
                name: 'Whirlwind',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'You may have your opponent switch his or her Active Pokemon ' +
                    'with 1 of his or her Benched Pokemon.'
            }];
        this.set = 'ROS';
        this.name = 'Beautifly';
        this.fullName = 'Beautifly ROS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useWhirlwind(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        // Prevent damage from Pokemon-EX
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (pokemonCard !== this || sourceCard === undefined) {
                return state;
            }
            // Do not ignore self-damage from Pokemon-Ex
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            const opponent = state_utils_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent) {
                return state;
            }
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            if (sourceCard.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
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
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Beautifly = Beautifly;
