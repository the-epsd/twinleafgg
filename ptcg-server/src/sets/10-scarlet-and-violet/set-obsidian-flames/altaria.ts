import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Altaria extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Swablu';
  public hp: number = 120;
  public cardType: CardType = N;
  public weakness = [];
  public retreat = [C];

  public attacks = [{
    name: 'Glide',
    cost: [C],
    damage: 30,
    text: ''
  },
  {
    name: 'Soothing Lullaby',
    cost: [W, M],
    damage: 110,
    text: 'Your opponent\'s Active Pokémon is now Asleep. During Pokémon Checkup, your opponent flips 2 coins instead of 1. If either of them is tails, that Pokémon is still Asleep.'
  }];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '160';
  public name: string = 'Altaria';
  public fullName: string = 'Altaria OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Soothing Lullaby
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
      opponent.active.sleepFlips = 2;
    }

    return state;
  }
}
