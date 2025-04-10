import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, StateUtils } from '../..';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';

export class Gengar extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Haunter';
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [
    {
    name: 'Sinister Fog',
    cost: [P],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 1 damage counter on each of your opponent\'s Benched Pokémon.'
    },
    {
    name: 'Creep Show',
    cost: [P, C],
    damage: 0,
    text: 'If your opponent\'s Active Pokémon has 3 or more damage counters on it, that Pokémon is Knocked Out.'
    },
  ];

  public set: string = 'BKT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Gengar';
  public fullName: string = 'Gengar BKT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList !== opponent.active) {
          const countersEffect = new PutCountersEffect(effect, 10);
          countersEffect.target = cardList;
          store.reduceEffect(state, countersEffect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.damage >= 30) {
        opponent.active.damage += 999;
      }
    }

    return state;
  }
}

