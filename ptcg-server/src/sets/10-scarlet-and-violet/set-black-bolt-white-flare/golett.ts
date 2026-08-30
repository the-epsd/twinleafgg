import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Golett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 90;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Best Punch',
    cost: [C, C],
    damage: 60,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public regulationMark = 'I';

  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Golett';
  public fullName: string = 'Golett SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Best Punch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
