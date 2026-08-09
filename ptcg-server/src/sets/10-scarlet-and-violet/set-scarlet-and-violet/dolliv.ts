import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Dolliv extends PokemonCard {

  public regulationMark = 'G';

  public evolvesFrom = 'Smoliv';

  public stage = Stage.STAGE_1;

  public cardType = CardType.GRASS;

  public hp = 90;

  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Slap',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: ''
    }, {
      name: 'Apply Oil',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 40,
      text: 'During your opponent\'s next turn, if the Defending Pokémon tries to attack, your opponent flips a coin. If tails, that attack doesn\'t happen.'
    }];

  public set = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '22';

  public name = 'Dolliv';

  public fullName = 'Dolliv SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK (Smokescreen)
    // Previous impl incorrectly used a prevent-damage marker instead of coin-cancel.
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this);
    }
    return state;
  }
}
