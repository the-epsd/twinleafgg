import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Aegislashex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Doublade';

  public cardType: CardType = CardType.METAL;

  public hp: number = 330;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Peerless Edge',
      cost: [CardType.METAL],
      damage: 70,
      text: 'This attack does 70 damage for each Prize card you have taken.'
    },

    {
      name: 'Double-Edged Slash',
      cost: [CardType.METAL, CardType.METAL],
      damage: 220,
      text: 'This Pokémon also does 30 damage to itself.'
    },
  ];

  public set: string = 'PAR';

  public setNumber = '135';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'G';

  public name: string = 'Aegislash ex';

  public fullName: string = 'Aegislash ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Peerless Edge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      effect.damage = 70 * (6 - player.getPrizeLeft());
    }

    // Double-Edged Slash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      // Legacy implementation:
      // - Created PutDamageEffect for 30 and targeted player.active directly.
      //
      // Converted to prefab version (THIS_POKEMON_DOES_DAMAGE_TO_ITSELF).
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }

    return state;
  }

}
