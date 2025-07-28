import { PlayerType } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Shaymin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'I';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Flower Curtain',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to your Benched Pokémon without a Rule Box by attacks from your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Smash Kick',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Shaymin';
  public fullName: string = 'Shaymin DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flower Curtain
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

      // Check if Shaymin is in play on the defending player's field
      let isShayminInPlay = false;
      defendingPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card instanceof Shaymin) {
          isShayminInPlay = true;
        }
      });
      if (!isShayminInPlay) {
        return state;
      }

      // Check if the target has a rule box (Shaymin limitation)
      if (effect.target.hasRuleBox()) {
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