import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DEFENDING_POKEMON_CANNOT_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class DialgaEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 180;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Chrono Wind',
    cost: [M, C, C],
    damage: 60,
    text: 'If the Defending Pokémon is a Pokémon-EX, it can\'t attack during your opponent\'s next turn.'
  },
  {
    name: 'Full Metal Impact',
    cost: [M, M, C, C],
    damage: 150,
    text: 'Discard 2 [M] Energy attached to this Pokémon.'
  }];

  public set: string = 'PHF';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dialga-EX';
  public fullName: string = 'Dialga-EX PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Chrono Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const defendingPokemon = opponent.active.getPokemonCard();

      if (defendingPokemon && defendingPokemon.tags.includes(CardTag.POKEMON_EX)) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    // Full Metal Impact
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, CardType.METAL);
    }

    return state;
  }
}
