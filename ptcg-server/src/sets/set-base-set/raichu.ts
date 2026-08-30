import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN } from '../../game/store/prefabs/effect-of-attack-prefabs';

export class Raichu extends PokemonCard {
  public name = 'Raichu';
  public set = 'BS';
  public fullName = 'Raichu BS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pikachu';
  public cardType: CardType[] = [L];
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    {
      name: 'Agility',
      cost: [L, C, C],
      damage: 20,
      text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, done to Raichu.'
    },
    {
      name: 'Thunder',
      cost: [L, L, L, C],
      damage: 60,
      text: 'Flip a coin. If tails, Raichu does 30 damage to itself.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, flipResult => {
        if (!flipResult) {
          const damageEffect = new DealDamageEffect(effect, 30);
          damageEffect.target = effect.player.active;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }

}
