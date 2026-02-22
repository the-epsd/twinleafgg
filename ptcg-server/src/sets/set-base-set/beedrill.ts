import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';

import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameMessage, StateUtils } from '../../game';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Beedrill extends PokemonCard {

  public set = 'BS';

  public name = 'Beedrill';

  public fullName = 'Beedrill BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '17';

  public stage: Stage = Stage.STAGE_2;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public evolvesFrom = 'Kakuna';

  public weakness = [{
    type: CardType.FIRE
  }];

  public resistance = [{
    type: CardType.FIGHTING,
    value: -30
  }];

  public attacks: Attack[] = [
    {
      name: 'Twineedle',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
    {
      name: 'Poison Sting',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: 40,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      return store.prompt(state, [
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP)
      ], (results) => {
        const heads = results.filter(r => !!r).length;
        effect.damage = 30 * heads;
      });

    }

    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    return state;

  }

}