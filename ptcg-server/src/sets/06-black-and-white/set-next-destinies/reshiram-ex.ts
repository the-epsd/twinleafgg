import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';

import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';

import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';

export class ReshiramEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 180;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Glinting Claw',
    cost: [R, C, C],
    damage: 50,
    text: 'Flip a coin. If heads, this attack does 30 more damage.'
  }, {
    name: 'Brave Fire',
    cost: [R, R, C, C],
    damage: 150,
    text: 'Flip a coin. If tails, this Pokemon does 50 damage to itself.'
  }];

  public set: string = 'NXD';
  public name: string = 'Reshiram-EX';
  public fullName: string = 'Reshiram EX NXD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result === true) {
          effect.damage += 30;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return COIN_FLIP_PROMPT(store, state, player, result => {
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
