import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';

import { CoinFlipPrompt, GameMessage, StoreLike, State, StateUtils } from '../../game';
import { AbstractAttackEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Meditite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];
  public evolvesInto = 'Medicham';
  public attacks = [{
    name: 'Detect',
    cost: [F],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokemon during your opponent\'s next turn.'
  },
  {
    name: 'Meditate',
    cost: [F, C],
    damage: 10,
    text: 'Does 10 damage plus 10 more damage for each damage counter on the Defending Pokémon.'
  }];

  public set: string = 'DP';
  public name: string = 'Meditite';
  public fullName: string = 'Meditite DP';
  public setNumber: string = '89';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          if (effect instanceof PutDamageEffect) {
            effect.preventDefault = true;
          }
          if (effect instanceof AbstractAttackEffect) {
            effect.preventDefault = true;
          }
        }
      }
      );
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.damage += opponent.active.damage;
      return state;
    }
    return state;
  }
}