import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, DEFENDING_POKEMON_ATTACKS_COST_MORE, DEFENDING_POKEMON_RETREAT_COSTS_MORE, AFTER_ATTACK, ADD_SLEEP_TO_PLAYER_ACTIVE } from "../../../game/store/prefabs/prefabs";

export class Gastrodon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shellos';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sticky Shot',
    cost: [W],
    damage: 20,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks cost [C] more, and its Retreat Cost is [C] more.'
  },
  {
    name: 'Water Pulse',
    cost: [W, W, W],
    damage: 60,
    text: 'Your opponent\'s Active Pokémon is now Asleep.'
  }];

  public set: string = 'STS';
  public setNumber: string = '29';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gastrodon';
  public fullName: string = 'Gastrodon STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sticky Shot
    if (WAS_ATTACK_USED(effect, 0, this)) {
      state = DEFENDING_POKEMON_ATTACKS_COST_MORE(store, state, effect, 1);
      state = DEFENDING_POKEMON_RETREAT_COSTS_MORE(store, state, effect, 1);
      return state;
    }
    // Water Pulse
    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
