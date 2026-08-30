import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Quilava extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cyndaquil';
  public hp: number = 80;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: 20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Fireworks',
    cost: [R, C],
    damage: 40,
    text: 'Flip a coin. If tails, discard a Fire Energy attached to Quilava.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Quilava';
  public fullName: string = 'Quilava MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fireworks
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (!result) {
          DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, R);
        }
      });
    }

    return state;
  }
}
