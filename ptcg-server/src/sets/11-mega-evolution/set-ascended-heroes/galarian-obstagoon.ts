import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class GalarianObstagoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Galarian Linoone';
  public hp: number = 170;
  public cardType: CardType[] = [D];
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Scarring Shout',
    cost: [D, C],
    damage: 70,
    damageCalculation: 'x',
    text: 'This attack does 70 damage for each damage counter on your opponent\'s Active Pokémon.'
  },
{
    name: 'Punk Smash',
    cost: [D, C, C],
    damage: 160,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '132';
  public name: string = 'Galarian Obstagoon';
  public fullName: string = 'Galarian Obstagoon ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scarring Shout
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);
      THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 2 * opponent.active.damage);
    }

    // Punk Smash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}
