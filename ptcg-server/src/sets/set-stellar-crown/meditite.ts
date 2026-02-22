/* eslint-disable indent */
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Meditite extends PokemonCard {

  public regulationMark = 'H';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public retreat = [C];
  public weakness = [{ type: P }];

  public attacks = [
    {
      name: 'Calm Mind',
      cost: [C],
      damage: 0,
      text: 'Heal 20 damage from this Pokémon.'
    },
    {
      name: 'Chop',
      cost: [F, C, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name: string = 'Meditite';
  public fullName: string = 'Meditite SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const healEffect = new HealEffect(player, effect.player.active, 20);
      state = store.reduceEffect(state, healEffect);
    }
    return state;
  }
}