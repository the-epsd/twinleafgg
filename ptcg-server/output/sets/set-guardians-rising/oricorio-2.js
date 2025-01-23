"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oricorio2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
// GRI Oricorio 56 (https://limitlesstcg.com/cards/GRI/56)
class Oricorio2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Supernatural Dance',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'For each Pokémon in your opponent\'s discard pile, put 1 damage counter on your opponent\'s Pokémon in any way you like. '
            },
            {
                name: 'Revelation Dance',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'If there is no Stadium card in play, this attack does nothing.'
            }
        ];
        this.set = 'GRI';
        this.setNumber = '56';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Oricorio';
        this.fullName = 'Oricorio GRI';
    }
    reduceEffect(store, state, effect) {
        // Supernatural Dance
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let pokemonCount = 0;
            opponent.discard.cards.forEach(c => {
                if (c instanceof pokemon_card_1.PokemonCard) {
                    pokemonCount += 10;
                }
            });
            if (pokemonCount === 0) {
                return state;
            }
            const maxAllowedDamage = [];
            let damageLeft = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                damageLeft += checkHpEffect.hp - cardList.damage;
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            const damage = Math.min(pokemonCount, damageLeft);
            return store.prompt(state, new game_2.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
                const results = targets || [];
                for (const result of results) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, result.target);
                    const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
                    putCountersEffect.target = target;
                    store.reduceEffect(state, putCountersEffect);
                }
            });
        }
        // Revelation Dance
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            if (!state_utils_1.StateUtils.getStadiumCard(state)) {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.Oricorio2 = Oricorio2;
