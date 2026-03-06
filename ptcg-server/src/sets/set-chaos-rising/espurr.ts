import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Espurr extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = P;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Buddy Attack',
    cost: [P],
    damage: 10,
    damageCalculation: '+' as '+',
    text: 'If you played Emma from your hand this turn, this attack does 60 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';
  public name: string = 'Espurr';
  public fullName: string = 'Espurr M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.marker.hasMarker('EMMA_PLAYED_THIS_TURN')) {
        effect.damage += 60;
      }
    }
    return state;
  }
}
