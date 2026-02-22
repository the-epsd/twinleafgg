import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IronHands extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = L;

  public tags = [CardTag.FUTURE];

  public hp: number = 140;

  public weakness = [{ type: F }];

  public resistance = [];

  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Volt Wave',
      cost: [L, C],
      damage: 30,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Superalloy Hands',
      cost: [L, L, C],
      damage: 80,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is a Pokémon ex or Pokémon V, this attack does 80 more damage.'
    }
  ];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '61';

  public name: string = 'Iron Hands';

  public fullName: string = 'Iron Hands TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {

        if (flipResult) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG(effect, state, 80, CardTag.POKEMON_ex, CardTag.POKEMON_V);
    }
    return state;
  }
}