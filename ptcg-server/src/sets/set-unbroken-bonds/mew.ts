import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Mew extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Bench Barrier',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to your Benched Pokémon by your opponent\'s attacks.'
  }];

  public attacks = [{
    name: 'Psypower',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Put 3 damage counters on your opponent\'s Pokémon in any way you like.'
  }];

  public set: string = 'UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '76';

  public name: string = 'Mew';

  public fullName: string = 'Mew UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(3, store, state, effect);
    }

    if (effect instanceof PutDamageEffect) {
      // Find the owner of the target (the defending player)
      const defendingPlayer = StateUtils.findOwner(state, effect.target);
      // Find the owner of the source (the attacking player)
      const attackingPlayer = StateUtils.findOwner(state, effect.source);

      // Only prevent if the effect is coming from the opponent
      if (attackingPlayer === defendingPlayer) {
        return state;
      }

      // Only prevent if the target is on the bench (not active)
      if (effect.target === defendingPlayer.active) {
        return state;
      }

      // Check if Manaphy is in play on the defending player's field
      let isManaphyInPlay = false;
      defendingPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card instanceof Mew) {
          isManaphyInPlay = true;
        }
      });
      if (!isManaphyInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(defendingPlayer, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      effect.preventDefault = true;
    }
    return state;
  }
}