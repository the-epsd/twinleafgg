import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { PutDamageEffect, AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MrMime extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Bench Barrier',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to your Benched Pokemon by attacks.'
  }];

  public attacks = [{
    name: 'Psy Bolt',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
  }];

  public set: string = 'PLF';

  public name: string = 'Mr. Mime';

  public fullName: string = 'Mr. Mime PLF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '47';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
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
