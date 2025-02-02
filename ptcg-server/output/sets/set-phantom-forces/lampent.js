"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lampent = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useCursedDrop(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const maxAllowedDamage = [];
    let damageLeft = 0;
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        damageLeft += checkHpEffect.hp - cardList.damage;
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
    });
    const damage = Math.min(30, damageLeft);
    return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
        const results = targets || [];
        for (const result of results) {
            const target = game_1.StateUtils.getTarget(state, player, result.target);
            const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
            putCountersEffect.target = target;
            store.reduceEffect(state, putCountersEffect);
        }
    });
}
class Lampent extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Litwick';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Cursed Drop',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Put 3 damage counters on your opponent\'s Pokemon ' +
                    'in any way you like.'
            },
            {
                name: 'Night March',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'This attack does 20 damage times the number of Pokemon ' +
                    'in your discard pile that have the Night March attack.'
            }
        ];
        this.set = 'PHF';
        this.name = 'Lampent';
        this.fullName = 'Lampent PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useCursedDrop(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let pokemonCount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof pokemon_card_1.PokemonCard && c.attacks.some(a => a.name === 'Night March')) {
                    pokemonCount += 1;
                }
            });
            effect.damage = pokemonCount * 20;
        }
        return state;
    }
}
exports.Lampent = Lampent;
