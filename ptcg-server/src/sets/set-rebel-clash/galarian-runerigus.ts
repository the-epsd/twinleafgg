import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GalarianRunerigus extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Galarian Yamask';
  public regulationMark = 'D';
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks =
    [
      {
        name: 'Spreading Spite',
        cost: [C, C],
        damage: 0,
        text: 'For each damage counter on this Galarian Runerigus, put 2 damage counters on your opponent\'s Pokémon in any way you like.'
      },
      {
        name: 'Mad Hammer',
        cost: [F, C, C],
        damage: 120,
        text: 'This Pokémon also does 30 damage to itself.'
      },
    ];

  public set: string = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Galarian Runerigus';
  public fullName: string = 'Galarian Runerigus RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const counters = effect.player.active.damage * 2;
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(counters, store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }

    return state;
  }
}