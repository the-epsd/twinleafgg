import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Beartic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cubchoo';
  public cardType: CardType[] = [W];
  public hp: number = 140;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Sheer Cold',
    cost: [W, C],
    damage: 40,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t attack.'
  },
  {
    name: 'Frost Smash',
    cost: [W, W, C],
    damage: 130,
    text: ''
  }];

  public regulationMark: string = 'F';
  public set: string = 'BRS';
  public setNumber: string = '43';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Beartic';
  public fullName: string = 'Beartic BRS 43';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sheer Cold
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
