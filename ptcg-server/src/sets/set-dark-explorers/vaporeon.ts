import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Vaporeon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Muddy Water',
      cost: [C],
      damage: 20,
      text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Spiral Drain',
      cost: [W, C, C],
      damage: 60,
      text: 'Heal 20 damage from this Pokémon.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vaporeon';
  public fullName: string = 'Vaporeon DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Muddy Water - 20 to active + 20 to benched
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (hasBenched) {
        THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
      }
    }

    // Spiral Drain - heal 20
    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(20, effect, store, state);
    }

    return state;
  }
}
