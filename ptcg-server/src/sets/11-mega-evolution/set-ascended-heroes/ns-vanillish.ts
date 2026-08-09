import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class NsVanillish extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'N\'s Vanillite';
  public tags = [CardTag.NS];
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Flop',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Sheer Cold',
    cost: [W, C, C],
    damage: 60,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t use attacks.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'N\'s Vanillish';
  public fullName: string = 'N\'s Vanillish M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sheer Cold
    // Ref: set-delta-reign/masquerain.ts (Scary Patterns)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
