import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class NsReshiram extends PokemonCard {

  public tags = [CardTag.NS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 130;
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Powerful Rage',
      cost: [R, L],
      damage: 20,
      text: 'This attack does 20 damage for each damage counter on this Pokémon.'
    },

    {
      name: 'Virtuous Flame',
      cost: [R, R, L, C],
      damage: 170,
      text: ''
    },

  ];

  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public set: string = 'JTG';
  public setNumber = '116';
  public name: string = 'N\'s Reshiram';
  public fullName: string = 'N\'s Reshiram JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      effect.damage = player.active.damage * 2;
    }

    return state;
  }

}