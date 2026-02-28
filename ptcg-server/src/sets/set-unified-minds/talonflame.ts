import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';
import { ADD_BURN_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Talonflame extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Fletchinder';
  public cardType: CardType = R;
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [];

  public attacks = [
    {
      name: 'Heat Wave',
      cost: [R],
      damage: 40,
      text: 'Your opponent\'s Active Pokémon is now Burned.'
    },
    {
      name: 'Flare Raid',
      cost: [R, C],
      damage: 100,
      text: 'Discard an Energy from this Pokémon. This attack does 50 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '32';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Talonflame';
  public fullName: string = 'Talonflame UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Heat Wave
    // Ref: AGENTS-patterns.md (Burned status)
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_BURN_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    // Attack 2: Flare Raid
    // Refs: set-unbroken-bonds/kyurem.ts (Hail Prison - discard energy), AGENTS-patterns.md (bench damage)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(50, effect, store, state);
    }

    return state;
  }
}
