import { CoinFlipPrompt, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MrMime extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Bench Barrier',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to your Benched Pokemon by attacks.'
  }];

  public attacks = [{
    name: 'Juggling',
    cost: [Y, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 4 coins. This attack does 10 damage times the number of heads.'
  }];

  public set: string = 'BKT';
  public name: string = 'Mr. Mime';
  public fullName: string = 'Mr. Mime BKT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 10 * heads;
      });
      return state;
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
        if (card instanceof MrMime) {
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