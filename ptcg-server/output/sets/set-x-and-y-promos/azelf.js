"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Azelf = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Azelf extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Shining Eyes',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Put 2 damage counters on each of your opponent\'s Pokémon that has any damage counters on it.'
            },
            {
                name: 'Mind Bend',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }];
        this.set = 'XYP';
        this.setNumber = '142';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Azelf';
        this.fullName = 'Azelf XYP';
    }
    reduceEffect(store, state, effect) {
        // if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        //   const player = effect.player;
        //   const opponent = StateUtils.getOpponent(state, player);
        //   const damagedPokemon: PokemonCardList[] = [];
        //   opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        //     if (cardList.damage > 0) {
        //       damagedPokemon.push(cardList);
        //     }
        //     if (damagedPokemon.length > 0) {
        //       damagedPokemon.forEach(target => {
        //         const damageEffect = new PutCountersEffect(effect, 20);
        //         damageEffect.target = cardList;
        //         store.reduceEffect(state, damageEffect);
        //       });
        //     }
        //   });
        //   return state;
        // }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0 && b.damage > 0);
            if (opponent.active.damage > 0) {
                const activeDamageEffect = new attack_effects_1.PutCountersEffect(effect, 20);
                store.reduceEffect(state, activeDamageEffect);
            }
            benched.forEach(target => {
                if (target.damage > 0) {
                    const damageEffect = new attack_effects_1.PutCountersEffect(effect, 20);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Azelf = Azelf;
