import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

import { AFTER_ATTACK, SWITCH_OUT_OPPONENT_ACTIVE_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Rhydon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Rhyhorn';
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public resistance = [{ type: L, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Horn Attack',
    cost: [F, C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Ram',
    cost: [F, F, F, F],
    damage: 50,
    text: 'Rhydon does 20 damage to itself. If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending Pokémon. (Do the damage before switching the Pokémon. Switch the Pokémon even if Rhydon is knocked out.)'
  }];

  public set: string = 'JU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Rhydon';
  public fullName: string = 'Rhydon JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 20);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentHasBenched = opponent.bench.some(b => b.cards.length > 0);

      if (!opponentHasBenched) {
        return state;
      }

      return SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, effect.player, {
        sourceEffect: effect,
      });
    }

    return state;
  }
}