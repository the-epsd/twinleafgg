import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS } from '../../game/store/prefabs/prefabs';

export class Manaphy extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Wave Veil',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to your Benched Pokémon by ' +
      'attacks from your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Rain Splash',
    cost: [CardType.WATER],
    damage: 20,
    text: ''
  }];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '41';

  public name: string = 'Manaphy';

  public fullName: string = 'Manaphy BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect) {
      /*
       * Legacy pre-prefab implementation:
       * - inferred defending/attacking owners from source/target
       * - checked bench-only targeting and opponent-only source
       * - scanned defending board for this Manaphy instance
       * - manually stubbed PowerEffect to respect ability lock
       * - set effect.preventDefault = true
       */
      // Converted to prefab version (PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS).
      state.players.forEach(owner => {
        PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS(store, state, effect, {
          owner,
          source: this,
          includeSourcePokemon: true
        });
      });
    }
    return state;
  }
}
