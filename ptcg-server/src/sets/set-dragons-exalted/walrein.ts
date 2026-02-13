import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class Walrein extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Sealeo';
  public cardType: CardType = W;
  public hp: number = 140;
  public weakness = [{ type: M }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Aurora Beam',
      cost: [W, C, C],
      damage: 80,
      text: ''
    },
    {
      name: 'Ice Entomb',
      cost: [W, W, C, C],
      damage: 60,
      text: 'The Defending Pokémon is now Paralyzed. This Pokémon can\'t use Ice Entomb during your next turn.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Walrein';
  public fullName: string = 'Walrein DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);

      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Ice Entomb')) {
        player.active.cannotUseAttacksNextTurnPending.push('Ice Entomb');
      }
    }

    return state;
  }
}
