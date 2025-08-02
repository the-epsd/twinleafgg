import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Thundurus extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Adverse Weather',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, prevent all damage done to your Benched Pokémon by attacks from your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Gigantic Bolt',
    cost: [CardType.LIGHTNING, CardType.LIGHTNING],
    damage: 140,
    text: 'This Pokémon also does 90 damage to itself.'
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '70';

  public name: string = 'Thundurus';

  public fullName: string = 'Thundurus OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const dealDamage = new DealDamageEffect(effect, 90);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
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

      // Check if Thundurus is active on the defending player's field
      let isThundurusActive = false;
      defendingPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card instanceof Thundurus && cardList === defendingPlayer.active) {
          isThundurusActive = true;
        }
      });
      if (!isThundurusActive) {
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
