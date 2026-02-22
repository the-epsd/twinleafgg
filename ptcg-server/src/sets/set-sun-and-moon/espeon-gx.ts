import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';

import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';

// SUM Espeon-GX 61 (https://limitlesstcg.com/cards/SUM/61)
export class EspeonGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 200;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Psybeam',
      cost: [CardType.PSYCHIC],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    },
    {
      name: 'Psychic',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: 'This attack does 30 more damage times the amount of Energy attached to your opponent\'s Active Pokémon.'
    },
    {
      name: 'Divide-GX',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Put 10 damage counters on your opponent\'s Pokémon in any way you like. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'SUM';

  public setNumber = '61';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Espeon-GX';

  public fullName: string = 'Espeon-GX SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psybeam
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      return store.reduceEffect(state, specialCondition);
    }

    // Psychic
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += opponentEnergyCount * 30;
    }

    // Divide-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;

      // Check if player has used GX attack
      BLOCK_IF_GX_ATTACK_USED(player);
      // set GX attack as used for game
      player.usedGX = true;

      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(10, store, state, effect);
    }

    return state;
  }
}