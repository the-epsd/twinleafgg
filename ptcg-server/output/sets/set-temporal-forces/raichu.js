"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raichu = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Raichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pikachu';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Collateral Bolts',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 50 damage to each other Pokémon in play with any damage counters on it. (Both yours and your opponent\'s. Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Electric Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Raichu';
        this.fullName = 'Raichu TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 50);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0 && card !== this) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 50);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Raichu = Raichu;
