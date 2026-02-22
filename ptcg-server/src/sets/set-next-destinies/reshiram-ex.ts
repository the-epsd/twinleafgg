import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt } from '../../game';

import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ReshiramEx extends PokemonCard {

  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 180;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Glinting Claw',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: 'Flip a coin. If heads, this attack does 30 more damage.'
    }, {
      name: 'Brave Fire',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: 150,
      text: 'Flip a coin. If tails, this Pokemon does 50 damage to itself.'
    },
  ];

  public set: string = 'NXD';

  public name: string = 'Reshiram-EX';

  public fullName: string = 'Reshiram EX NXD';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '22';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 30;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === false) {
          const dealDamage = new DealDamageEffect(effect, 50);
          dealDamage.target = player.active;
          return store.reduceEffect(state, dealDamage);
        }
      });
    }

    return state;
  }

}
