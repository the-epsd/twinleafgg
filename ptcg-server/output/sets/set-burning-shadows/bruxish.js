"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bruxish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const card_types_2 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Bruxish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Gnash Teeth',
                cost: [W],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Confused.',
            },
            {
                name: 'Synchronoise',
                cost: [W, C, C],
                damage: 60,
                text: 'This attack does 20 damage to each of your opponent\'s Benched Pokémon that shares a type with your opponent\'s Active Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
            }
        ];
        this.set = 'BUS';
        this.name = 'Bruxish';
        this.fullName = 'Bruxish BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defendingPokemon = opponent.active;
            if (defendingPokemon.cards.length > 0) {
                const defendingCard = defendingPokemon.cards[0];
                const defendingType = defendingCard.cardType;
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    if (cardList !== defendingPokemon && cardList.cards.length > 0) {
                        const card = cardList.cards[0];
                        if (card.cardType === defendingType) {
                            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                            damageEffect.target = cardList;
                            state = store.reduceEffect(state, damageEffect);
                        }
                    }
                    return state;
                });
            }
        }
        return state;
    }
}
exports.Bruxish = Bruxish;
