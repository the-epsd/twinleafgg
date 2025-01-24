"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EspeonGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const card_types_2 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_3 = require("../../game");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
const check_effects_2 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
// SUM Espeon-GX 61 (https://limitlesstcg.com/cards/SUM/61)
class EspeonGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Psybeam',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            },
            {
                name: 'Psychic',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'This attack does 30 more damage times the amount of Energy attached to your opponent\'s Active Pokémon.'
            },
            {
                name: 'Divide-GX',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 10 damage counters on your opponent\'s Pokémon in any way you like. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'SUM';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Espeon-GX';
        this.fullName = 'Espeon-GX SUM';
    }
    reduceEffect(store, state, effect) {
        // Psybeam
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.CONFUSED]);
            return store.reduceEffect(state, specialCondition);
        }
        // Psychic
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += opponentEnergyCount * 30;
        }
        // Divide-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_2.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            const maxAllowedDamage = [];
            let damageLeft = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_2.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                damageLeft += checkHpEffect.hp - cardList.damage;
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            const damage = Math.min(100, damageLeft);
            return store.prompt(state, new game_3.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
                const results = targets || [];
                for (const result of results) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, result.target);
                    const putCountersEffect = new attack_effects_2.PutCountersEffect(effect, result.damage);
                    putCountersEffect.target = target;
                    store.reduceEffect(state, putCountersEffect);
                }
            });
        }
        return state;
    }
}
exports.EspeonGX = EspeonGX;
