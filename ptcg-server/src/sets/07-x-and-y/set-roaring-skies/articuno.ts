import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { GameMessage } from '../../../game/game-message';
import { CoinFlipPrompt } from '../../../game/store/prompts/coin-flip-prompt';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { DELTA_PLUS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Articuno extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Delta Plus',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'If your opponent\'s Pokemon is Knocked Out by damage from an ' +
      'attack of this Pokemon, take 1 more Prize card.'
  }];

  public attacks = [{
    name: 'Chilling Sigh',
    cost: [W],
    damage: 0,
    text: 'Your opponent\'s Active Pokemon is now Asleep.'
  },
  {
    name: 'Tri Edge',
    cost: [W, W, C],
    damage: 20,
    text: 'Flip 3 coins. This attack does 40 more damage for each heads.'
  }];

  public set: string = 'ROS';
  public name: string = 'Articuno';
  public fullName: string = 'Articuno ROS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Chilling Sigh
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }
    // Tri Edge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 40 * heads;
      });
    }

    return DELTA_PLUS(store, state, effect, this);
  }
}