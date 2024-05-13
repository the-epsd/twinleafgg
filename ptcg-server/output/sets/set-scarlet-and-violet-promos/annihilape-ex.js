"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Annihilapeex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useAngryGrudge(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const hasBenched = opponent.bench.some(b => b.cards.length > 0);
    if (!hasBenched) {
        return state;
    }
    const maxAllowedDamage = [];
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        maxAllowedDamage.push({ target, damage: 120 });
    });
    const damage = 10;
    return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], damage, maxAllowedDamage, { allowCancel: false }), targets => {
        const results = targets || [];
        for (const result of results) {
            const target = game_1.StateUtils.getTarget(state, player, result.target);
            const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
            putCountersEffect.target = target;
            store.reduceEffect(state, putCountersEffect);
            effect.damage = results.length * 20;
        }
    });
}
class Annihilapeex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Primape';
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 320;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Angry Grudge',
                cost: [],
                damage: 0,
                text: 'Put up to 12 damage counters on this Pokémon. This attack does 20 damage for each damage counter you placed in this way.'
            },
            {
                name: 'Seismic Toss',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 150,
                text: ''
            }
        ];
        this.set = 'SVP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Annihilape ex';
        this.fullName = 'Annihilape ex SVP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useAngryGrudge(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Annihilapeex = Annihilapeex;
