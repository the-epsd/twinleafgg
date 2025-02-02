"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragapultex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const __1 = require("../..");
function* usePhantomDive(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const hasBenched = opponent.bench.some(b => b.cards.length > 0);
    if (!hasBenched) {
        return state;
    }
    const maxAllowedDamage = [];
    opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        maxAllowedDamage.push({ target, damage: card.hp + 60 });
    });
    const damage = 60;
    return store.prompt(state, new __1.PutDamagePrompt(effect.player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
        const results = targets || [];
        for (const result of results) {
            const target = state_utils_1.StateUtils.getTarget(state, player, result.target);
            const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
            putCountersEffect.target = target;
            store.reduceEffect(state, putCountersEffect);
        }
    });
}
class Dragapultex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Drakloak';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 320;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Jet Headbutt',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }, {
                name: 'Phantom Dive',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.PSYCHIC],
                damage: 200,
                text: 'Put 6 damage counters on your opponent\'s Benched Pokemon in any way you like.'
            }];
        this.set = 'SV6';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Dragapult ex';
        this.fullName = 'Dragapult ex SV6';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = usePhantomDive(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[1], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // Target is this Charizard
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[1], this);
                    store.reduceEffect(state, powerEffect);
                }
                catch (_b) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Dragapultex = Dragapultex;
