import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';

import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Zapdos extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp: number = 80;
  public weakness = [];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Thunderstorm',
    cost: [L, L, L, L],
    damage: 40,
    text: 'For each of your opponent\'s Benched Pokémon, flip a coin. If heads, this attack does 20 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Then, Zapdos does 10 damage times the number of tails to itself.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Zapdos';
  public fullName: string = 'Zapdos FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let tailsCount = 0;

      opponent.bench.forEach(target => {
        state = COIN_FLIP_PROMPT(store, state, player, flipResult => {
            if (flipResult) {
              const damageEffect = new PutDamageEffect(effect, 30);
              damageEffect.target = target;
              store.reduceEffect(state, damageEffect);
            } else {
              tailsCount++;
            }
          });
      });

      const dealDamage = new DealDamageEffect(effect, 10 * tailsCount);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);

      return state;
    }
    return state;
  }
}
