import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Crocalor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Fuecoco';
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Heat Breath',
    cost: [R, C],
    damage: 30,
    text: 'Flip a coin. If heads, this attack does 50 more damage.'
  }];

  public regulationMark = 'H';

  public set: string = 'SSP';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Crocalor';
  public fullName: string = 'Crocalor SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {
          effect.damage += 50;
        }
      });
    }

    return state;
  }

}
