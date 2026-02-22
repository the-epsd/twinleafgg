import { GameMessage, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Nidoking extends PokemonCard {

  public set = 'BS';

  public name = 'Nidoking';

  public fullName = 'Nidoking BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '11';

  public stage: Stage = Stage.STAGE_2;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Thrash',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'Flip a coin. If heads, this attack does 30 damage plus 10 more damage; if tails, this attack does 30 damage plus Nidoking does 10 damage to itself.'
    },
    {
      name: 'Toxic',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: 20,
      text: 'The Defending Pokémon is now Poisoned. It now takes 20 Poison damage instead of 10 after each player\'s turn (even if it was already Poisoned).'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      return store.prompt(state, new CoinFlipPrompt(
        effect.player.id, GameMessage.FLIP_COIN
      ), (heads) => {
        if (heads) {
          effect.damage += 10;
        } else {
          const selfDamage = new DealDamageEffect(effect, 10);
          selfDamage.target = effect.player.active;
          store.reduceEffect(state, selfDamage);
        }
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this, 20);
    }

    return state;
  }

}