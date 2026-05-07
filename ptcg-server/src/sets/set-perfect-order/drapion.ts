import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, ADD_POISON_TO_PLAYER_ACTIVE, ADD_PARALYZED_TO_PLAYER_ACTIVE } from '../../game/store/prefabs/prefabs';

export class Drapion extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Skorupi';
  public cardType: CardType = D;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Wrack Down',
    cost: [D, D],
    damage: 60,
    text: ''
  },
  {
    name: 'Hazardous Tail',
    cost: [D, D, D],
    damage: 100,
    text: 'This Pokémon also does 70 damage to itself. Your opponent\'s Active Pokémon is now Paralyzed and Poisoned.'
  }];

  public regulationMark = 'J';
  public set: string = 'POR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Drapion';
  public fullName: string = 'Drapion M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hazard Tail - self-damage and poison/paralyze
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 70);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
