import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
  THIS_POKEMON_DOES_DAMAGE_TO_ITSELF,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Hippowdon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hippopotas';
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Resistance Desert',
    cost: [F, C, C],
    damage: 60,
    text: 'During your opponent\'s next turn, prevent all effects of attacks, including damage, done to this Pokémon by Pokémon-EX.'
  },
  {
    name: 'Double-Edge',
    cost: [F, F, C, C],
    damage: 100,
    text: 'This Pokémon does 20 damage to itself.'
  }];

  public set: string = 'PRC';
  public setNumber: string = '88';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hippowdon';
  public fullName: string = 'Hippowdon PRC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Resistance Desert
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const options = { sourceTags: [CardTag.POKEMON_EX] };
      PREVENT_DAMAGE(store, state, effect, this, options);
      PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this, options);
    }

    // Double-Edge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
    }

    return state;
  }
}
