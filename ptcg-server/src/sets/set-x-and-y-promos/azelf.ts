import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';

export class Azelf extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 70;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Shining Eyes',
    cost: [CardType.PSYCHIC],
    damage: 0,
    text: 'Put 2 damage counters on each of your opponent\'s Pokémon that has any damage counters on it.'
  },
  {
    name: 'Mind Bend',
    cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: 'Your opponent\'s Active Pokémon is now Confused.'
  }];

  public set: string = 'XYP';
  public setNumber: string = '142';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Azelf';
  public fullName: string = 'Azelf XYP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = effect.opponent;

      if (opponent.active.damage > 0) {
        const activeDamageEffect = new PutCountersEffect(effect, 20);
        activeDamageEffect.target = opponent.active;
        store.reduceEffect(state, activeDamageEffect);
      }

      opponent.bench.forEach((bench, index) => {
        if (bench.cards.length > 0 && bench.damage > 0) {
          const damageEffect = new PutCountersEffect(effect, 20);
          damageEffect.target = bench;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}