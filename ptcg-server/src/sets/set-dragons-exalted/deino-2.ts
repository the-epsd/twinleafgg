import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Deino2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 60;
  public weakness = [{ type: N }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Guard Press',
      cost: [D],
      damage: 10,
      text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 10 (after applying Weakness and Resistance).'
    },
    {
      name: 'Headbutt',
      cost: [P, C, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '94';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Deino';
  public fullName: string = 'Deino DRX 94';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 10;
    }

    return state;
  }
}
