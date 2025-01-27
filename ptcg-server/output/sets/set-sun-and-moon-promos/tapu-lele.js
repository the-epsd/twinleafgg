"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuLele = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const check_effects_2 = require("../../game/store/effects/check-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const move_damage_prompt_1 = require("../../game/store/prompts/move-damage-prompt");
const game_message_1 = require("../../game/game-message");
function* useMagicalSwap(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const maxAllowedDamage = [];
    opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new check_effects_2.CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
    });
    return store.prompt(state, new move_damage_prompt_1.MoveDamagePrompt(effect.player.id, game_message_1.GameMessage.MOVE_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], maxAllowedDamage, { allowCancel: true }), transfers => {
        if (transfers === null) {
            return;
        }
        for (const transfer of transfers) {
            const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
            const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
            if (source.damage >= 10) {
                source.damage -= 10;
                target.damage += 10;
            }
        }
    });
}
class TapuLele extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Psywave',
                cost: [P],
                damage: 20,
                text: 'This attack does 20 damage times the amount of Energy attached to your opponent\'s Active Pokémon.'
            },
            {
                name: 'Magical Swap',
                cost: [P, C],
                damage: 0,
                text: 'Move any number of damage counters on your opponent\'s Pokémon to their other Pokémon in any way you like.'
            },
        ];
        this.set = 'SMP';
        this.setNumber = 'SM45';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tapu Lele';
        this.fullName = 'Tapu Lele SMP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage = opponentEnergyCount * 20;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = useMagicalSwap(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TapuLele = TapuLele;
