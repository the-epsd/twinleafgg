import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class KyuremEx extends PokemonCard {
  protected _tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 180;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Glaciate',
    cost: [W, W, C],
    damage: 0,
    text: 'This attack does 30 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Icecalibur',
    cost: [W, W, W, C],
    damage: 130,
    text: 'Discard an Energy attached to this Pokémon. The Defending Pokémon can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'AOR';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kyurem-EX';
  public fullName: string = 'Kyurem-EX AOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Glaciate
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);

      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = opponent.active;
      store.reduceEffect(state, dealDamage);

      opponent.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const damage = new PutDamageEffect(effect, 30);
          damage.target = benched;
          store.reduceEffect(state, damage);
        }
      });
    }

    // Icecalibur
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
      return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
