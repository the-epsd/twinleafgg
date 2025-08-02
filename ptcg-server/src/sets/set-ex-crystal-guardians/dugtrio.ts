import { PlayerType } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Dugtrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Diglett';
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Sand Veil',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all damage done to your Benched Pokémon by your opponent\'s attacks.'
  }];

  public attacks = [
    {
      name: 'Dig Under',
      cost: [F, C],
      damage: 0,
      text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance.'
    },
    {
      name: 'Double-edge',
      cost: [F, C, C],
      damage: 60,
      text: 'Dugtrio does 10 damage to itself.'
    },
  ];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Dugtrio';
  public fullName: string = 'Dugtrio CG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dig Under
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state);
    }

    // Double-edge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    // Sand Veil
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
        if (card instanceof Dugtrio) {
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