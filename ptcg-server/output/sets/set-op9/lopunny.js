"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lopunny = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Lopunny extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Buneary';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 80;
        this.weakness = [{
                type: card_types_1.CardType.FIGHTING,
                value: 20
            }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Jump Kick',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Does 20 damage to 1 of your opponent\'s Benched Pokemon. (Don\'t ' +
                    'apply Weakness and Resistance for Benched Pokemon.)'
            }, {
                name: 'Jazzed',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'If Lopunny evolved from Buneary during this turn, remove all ' +
                    'damage counters from Lopunny.'
            }];
        this.set = 'OP9';
        this.name = 'Lopunny';
        this.fullName = 'Lopunny OP9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.BENCH], { allowCancel: false }), targets => {
                targets.forEach(target => {
                    const dealDamage = new attack_effects_1.PutDamageEffect(effect, 20);
                    dealDamage.target = target;
                    return store.reduceEffect(state, dealDamage);
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.active.pokemonPlayedTurn === state.turn) {
                player.active.damage = 0;
            }
        }
        return state;
    }
}
exports.Lopunny = Lopunny;
