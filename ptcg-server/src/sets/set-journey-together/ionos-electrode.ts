import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { DealDamageEffect, KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IonosElectrode extends PokemonCard {

  public tags = [CardTag.IONOS];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Iono\'s Voltorb';

  public cardType: CardType = L;

  public hp: number = 100;

  public weakness = [{ type: F }];

  public retreat = [];

  public attacks = [
    {
      name: 'Thump-Thump Boom',
      cost: [L, L],
      damage: 0,
      text: 'This Pokémon does 100 damage to itself. Flip a coin. If heads, your opponent\'s Active Pokémon is Knocked Out.'
    },
    {
      name: 'Electric Ball',
      cost: [L, L, C],
      damage: 100,
      text: ''
    },
  ];

  public regulationMark = 'I';

  public cardImage: string = 'assets/cardback.png';

  public set: string = 'JTG';

  public setNumber = '48';

  public name: string = 'Iono\'s Electrode';

  public fullName: string = 'Iono\'s Electrode JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const dealDamage = new DealDamageEffect(effect, 100);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);

      return store.prompt(state, new CoinFlipPrompt(
        effect.player.id, GameMessage.FLIP_COIN
      ), (result) => {
        if (!result) {
          const dealDamage = new KnockOutOpponentEffect(effect, 999);
          dealDamage.target = opponent.active;
          store.reduceEffect(state, dealDamage);
        }
      });

    }

    return state;
  }

}