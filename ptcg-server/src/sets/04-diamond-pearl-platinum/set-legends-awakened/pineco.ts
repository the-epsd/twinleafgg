import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';

export class Pineco extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Selfdestruct',
    cost: [G, C],
    damage: 40,
    text: 'This attack does 10 damage to each Benched Pokémon (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokémon.) Pineco does 50 damage to itself.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '113';
  public name: string = 'Pineco';
  public fullName: string = 'Pineco LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Selfdestruct
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.bench.forEach(benchSlot => {
      if (benchSlot.cards.length > 0) {
      const damageEffect = new PutDamageEffect(effect, 10);
      damageEffect.target = benchSlot;
      store.reduceEffect(state, damageEffect);
      }
      });
      player.bench.forEach(benchSlot => {
      if (benchSlot.cards.length > 0) {
      const damageEffect = new PutDamageEffect(effect, 10);
      damageEffect.target = benchSlot;
      store.reduceEffect(state, damageEffect);
      }
      });
    }

    return state;
  }
}
