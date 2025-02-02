import { CoinFlipPrompt, GameMessage, PlayerType, PowerType, StateUtils } from '../..';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Machoke extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Machop';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 100;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Daunting Pose',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to your Benched Pokémon by your opponent\'s attacks. Your opponent\'s attacks and Abilities can\'t put damage counters on your Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Cross Chop',
    cost: [ CardType.FIGHTING, CardType.FIGHTING ],
    damage: 30,
    text: 'Flip a coin. If heads, this attack does 30 more damage.'
  }];

  public set: string = 'GRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '64';

  public name: string = 'Machoke';

  public fullName: string = 'Machoke GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result) {
          effect.damage += 30;
        }
      });
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      const targetPlayer = StateUtils.findOwner(state, effect.target);

      let isMachoke1InPlay = false;
      targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isMachoke1InPlay = true;
        }
      });

      if (!isMachoke1InPlay) {
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

      effect.preventDefault = true;
    }
    
    if (effect instanceof PutCountersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (opponent.active) {

        let isMachoke2InPlay = false;
        targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card === this) {
            isMachoke2InPlay = true;
          }
        });

        if (!isMachoke2InPlay) {
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

        effect.preventDefault = true;
      }

      return state;
    }
    return state;
  }

}