import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Slowbro extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Slowpoke';
  public hp: number = 80;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Amnesia',
    cost: [C, C],
    damage: 20,
    text: 'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
{
    name: 'Zen Headbutt',
    cost: [P, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Slowbro';
  public fullName: string = 'Slowbro GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Amnesia
    if (WAS_ATTACK_USED(effect, 0, this)) {
      OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
