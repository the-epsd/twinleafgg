import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, GUST_OPPONENT_BENCHED_POKEMON } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_ATTACKS_COST_MORE, DEFENDING_POKEMON_RETREAT_COSTS_MORE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Araquanid extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Dewpider';
  public cardType: CardType[] = [W];
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Tangle Drag',
    cost: [C],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.'
  },
  {
    name: 'Sticky Web',
    cost: [W, C, C],
    damage: 80,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks cost [C] more, and its Retreat Cost is [C] more.'
  }];

  public set: string = 'UNM';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Araquanid';
  public fullName: string = 'Araquanid UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tangle Drag
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      GUST_OPPONENT_BENCHED_POKEMON(store, state, player);
    }

    // Sticky Web
    if (WAS_ATTACK_USED(effect, 1, this)) {
      state = DEFENDING_POKEMON_ATTACKS_COST_MORE(store, state, effect, 1);
      state = DEFENDING_POKEMON_RETREAT_COSTS_MORE(store, state, effect, 1);
    }

    return state;
  }
}
