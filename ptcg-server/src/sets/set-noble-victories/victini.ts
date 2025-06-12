import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Victini extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'V-create',
    cost: [R, C],
    damage: 100,
    text: 'If you have 4 or fewer Benched Pokémon, this attack does nothing.'
  }];

  public set: string = 'NVI';
  public name: string = 'Victini';
  public fullName: string = 'Victini NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      if (playerBench <= 4) {
        return state;
      }
    }

    return state;
  }

}
