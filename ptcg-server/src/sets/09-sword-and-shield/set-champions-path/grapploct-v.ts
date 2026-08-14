import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';

export class GrapploctV extends PokemonCard {
  protected _tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 210;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tie Up',
    cost: [F],
    damage: 20,
    text: 'If the Defending Pokémon is a Basic Pokémon, it can\'t attack during your opponent\'s next turn.'
  }, {
    name: 'Moonsault Press',
    cost: [F, F, C],
    damage: 120,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 100 more damage.'
  }];

  public regulationMark: string = 'D';
  public set: string = 'CPA';
  public setNumber: string = '32';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Grapploct V';
  public fullName: string = 'Grapploct V CPA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tie Up
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.getPokemonCard()?.stage === Stage.BASIC) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    // Moonsault Press
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 100);
    }

    return state;
  }
}
