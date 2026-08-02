import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { OPPONENT_CANNOT_PLAY_POKEMON_WITH_ABILITIES, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Chimecho extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Bell of Silence',
    cost: [P],
    damage: 10,
    text: 'Your opponent can\'t play any Pokémon that has an Ability from their hand during their next turn.'
  }];

  public set: string = 'CIN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Chimecho';
  public fullName: string = 'Chimecho CIN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bell of Silence
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_POKEMON_WITH_ABILITIES(store, state, effect, this);
    }

    return state;
  }
}
