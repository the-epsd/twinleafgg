import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Feebas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'H';
  public cardType: CardType = W;
  public hp: number = 30;
  public weakness = [{ type: L }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Flail',
      cost: [ W ],
      damage: 10,
      damageCalculation: 'x',
      text: 'This attack does 10 damage for each damage counter on this Pokémon.'
    }
  ];

  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Feebas';
  public fullName: string = 'Feebas TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flail
    if (WAS_ATTACK_USED(effect, 0, this)){
      effect.damage = effect.player.active.damage;
    }

    return state;
  }
}