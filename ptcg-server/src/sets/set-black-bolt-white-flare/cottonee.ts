import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { HealEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Cottonee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public attacks = [
    {
      name: 'Absorb',
      cost: [G],
      damage: 10,
      text: 'Heal 10 damage from this Pokémon.'
    }
  ];

  public set: string = 'WHT';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Cottonee';
  public fullName: string = 'Cottonee SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const healEffect = new HealEffect(player, player.active, 10);
      store.reduceEffect(state, healEffect);
      return state;
    }
    return state;
  }
} 