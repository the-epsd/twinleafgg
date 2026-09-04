import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { COPY_OPPONENT_ACTIVE_AND_BENCH_ATTACK } from '../../../game/store/prefabs/copy-attack-prefabs';

export class Nihilego extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [CardType.PSYCHIC];
  public hp: number = 110;
  public tag = [CardTag.ULTRA_BEAST];
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Nightcap',
      cost: [CardType.PSYCHIC],
      damage: 0,
      copycatAttack: true,
      text: 'You can use this attack only if your opponent has exactly 2 Prize cards remaining. Choose 1 of your opponent\'s Pokemon\'s attacks and use it as this attack.'
    },
    {
      name: 'Void Tentacles',
      cost: [CardType.PSYCHIC],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Confused and Poisoned.'
    },
  ];

  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Nihilego';
  public fullName: string = 'Nihilego LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.getPrizeLeft() !== 2) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return COPY_OPPONENT_ACTIVE_AND_BENCH_ATTACK(store, state, effect as AttackEffect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED, SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}
