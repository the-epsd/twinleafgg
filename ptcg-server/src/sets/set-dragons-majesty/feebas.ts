import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Feebas extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 30;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Submerge',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokemon is on your Bench, prevent all damage ' +
      'done to this Pokemon by attacks (both yours and your opponent\'s).'
  }];

  public attacks = [{
    name: 'Rain Splash',
    cost: [CardType.WATER],
    damage: 10,
    text: ''
  }];

  public set: string = 'DRM';

  public name: string = 'Feebas';

  public fullName: string = 'Feebas BCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '28';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      // Target is this Feebas
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const stub = new PowerEffect(player, {
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
    }

    return state;
  }

}
