import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Vileplume extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Gloom';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 120;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Allergy Flower',
    powerType: PowerType.POKEBODY,
    text: 'Each player can\'t play any Trainer cards from his or her hand.'
  }];

  public attacks = [{
    name: 'Dazzling Pollen',
    cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
    damage: 50,
    text: 'Flip a coin. If heads, this attack does 50 damage plus 20 more ' +
      'damage. If tails, the Defending Pokemon is now Confused.'
  }];

  public set: string = 'UD';

  public name: string = 'Vileplume';

  public fullName: string = 'Vileplume UD';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '24';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result) {
          effect.damage += 20;
        } else {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    // Block trainer cards
    if (effect instanceof PlayItemEffect && StateUtils.isPokemonInPlay(effect.player, this)) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    return state;
  }

}
