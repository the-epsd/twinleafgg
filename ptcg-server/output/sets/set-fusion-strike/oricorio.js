"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oricorio = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Oricorio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Lesson in Zeal',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'All of your Fusion Strike Pokémon take 20 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance). You can\'t apply more than 1 Lesson in Zeal Ability at a time.'
            }];
        this.attacks = [{
                name: 'Glistening Droplets',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 5 damage counters on your opponent\'s Pokémon in ' +
                    'any way you like.'
            }];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Oricorio';
        this.fullName = 'Oricorio FST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const maxAllowedDamage = [];
            let damageLeft = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                damageLeft += checkHpEffect.hp - cardList.damage;
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            const damage = Math.min(50, damageLeft);
            return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
                const results = targets || [];
                for (const result of results) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, result.target);
                    const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
                    putCountersEffect.target = target;
                    store.reduceEffect(state, putCountersEffect);
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const activePokemon = player.active.getPokemonCard();
            const activeFusion = activePokemon && activePokemon.tags.includes(card_types_1.CardTag.FUSION_STRIKE);
            const benchPokemon = player.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined);
            const benchFusion = benchPokemon.filter(card => card.tags.includes(card_types_1.CardTag.FUSION_STRIKE));
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
            if (activeFusion || benchFusion) {
                effect.damage -= 20;
            }
            return state;
        }
        return state;
    }
}
exports.Oricorio = Oricorio;
