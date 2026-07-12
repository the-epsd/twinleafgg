import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MEGA_EVOLUTION_END_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class MAlakazamEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX, CardTag.MEGA];
  public stage: Stage = Stage.MEGA;
  public evolvesFrom = 'Alakazam-EX';
  public cardType: CardType = P;
  public hp: number = 210;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Zen Force',
    cost: [P, C],
    damage: 10,
    damageCalculation: '+',
    text: "This attack does 30 more damage for each damage counter on your opponent's Active Pokémon.",
  }];

  public set: string = 'FCO';
  public name: string = 'M Alakazam-EX';
  public fullName: string = 'M Alakazam-EX FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    MEGA_EVOLUTION_END_TURN(store, state, effect, this);

    // Zen Force
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage += effect.opponent.active.damage * 3;
    }

    return state;
  }
}
