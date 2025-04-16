import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Dondozo extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public evolvesFrom = 'Dondozo';
  public cardType: CardType = W;
  public hp: number = 160;
  public weakness = [{ type: L }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Release Rage',
      cost: [C, C],
      damage: 50,
      damageCalculation: 'x',
      text: 'This attack does 50 damage for each Tatsugiri in your discard pile.'
    },
    {
      name: 'Heavy Splash',
      cost: [W, W, C, C],
      damage: 120,
      text: ''
    }
  ];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Dondozo';
  public fullName: string = 'Dondozo SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const cards = effect.player.discard.cards.filter(c => c.name === 'Tatsugiri');
      effect.damage = cards.length * 50;
      return state;
    }
    return state;
  }
}