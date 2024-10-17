"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianBraviary = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class HisuianBraviary extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rufflet';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Eerie Cry',
                cost: [],
                damage: 0,
                text: 'Put 3 damage counters on each of your opponent\'s Pokémon that has any damage counters on it.'
            },
            {
                name: 'Mind Bend',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }
        ];
        this.set = 'SIT';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '149';
        this.name = 'Hisuian Braviary';
        this.fullName = 'Hisuian Braviary SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (cardList.damage === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, 30);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
            });
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                opponent.active.specialConditions.push(card_types_1.SpecialCondition.CONFUSED);
            }
            return state;
        }
        return state;
    }
}
exports.HisuianBraviary = HisuianBraviary;
