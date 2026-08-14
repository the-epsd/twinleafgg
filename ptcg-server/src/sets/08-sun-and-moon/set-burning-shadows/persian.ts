import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Persian extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Meowth';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Screech',
    cost: [C],
    damage: 0,
    text: 'During your next turn, the Defending Pokémon takes 60 more damage from attacks (after applying Weakness and Resistance).'
  },
  {
    name: 'Slash',
    cost: [C],
    damage: 40,
    text: ''
  }];

  public set: string = 'BUS';
  public setNumber: string = '102';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Persian';
  public fullName: string = 'Persian BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Screech
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_TAKES_MORE_DAMAGE_DURING_YOUR_NEXT_TURN(store, state, effect, this, 60);
    }

    return state;
  }
}
