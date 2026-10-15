import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Okidogi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 140;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Light Punch',
    cost: [F],
    damage: 20,
    text: ''
  },
{
    name: 'Settle the Score',
    cost: [F, F, C],
    damage: 80,
    damageCalculation: '+',
    text: 'This attack does 60 more damage for each Prize card your opponent took during their last turn.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '122';
  public name: string = 'Okidogi';
  public fullName: string = 'Okidogi ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Settle the Score
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const prizesTaken = opponent.prizesTakenLastTurn;
      effect.damage += prizesTaken * 100;
    }

    return state;
  }
}
