import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class TapuKoko extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Electro Ball',
      cost: [L],
      damage: 30,
      text: ''
    },
    {
      name: 'Nature Dive',
      cost: [L, L, C],
      damage: 100,
      damageCalculation: '+' as '+',
      text: 'If your opponent\'s Active Pokémon is an Ultra Beast, this attack does 100 more damage, and discard 2 Energy from this Pokémon.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '69';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tapu Koko';
  public fullName: string = 'Tapu Koko UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 2: Nature Dive
    // Ref: set-team-up/tentacruel.ts (Ultra Beast tag check)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.tags.includes(CardTag.ULTRA_BEAST)) {
        effect.damage += 100;
        DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
      }
    }

    return state;
  }
}
