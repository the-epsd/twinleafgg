import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dusclops extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Duskull';
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 90;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Disable',
    cost: [CardType.PSYCHIC],
    damage: 20,
    text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn. '
  }];

  public set: string = 'CEC';
  public name: string = 'Dusclops';
  public fullName: string = 'Dusclops CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
