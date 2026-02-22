import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PutDamageEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class NsVanilluxe extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'N\'s Vanillish';
  public tags = [CardTag.NS];
  public cardType: CardType = W;
  public hp: number = 150;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Snow Coating',
    cost: [C, C],
    damage: 0,
    text: 'Double the number of damage counters on each of your opponent\'s Pokémon.'
  },
  {
    name: 'Blizzard',
    cost: [W, C, C],
    damage: 120,
    text: 'This attack also does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'N\'s Vanilluxe';
  public fullName: string = 'N\'s Vanilluxe M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Layered Snow - double damage counters on each opponent's Pokémon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.length > 0 && cardList.damage > 0) {
          // Double the damage by adding the same amount
          const damageToAdd = cardList.damage;
          const countersEffect = new PutCountersEffect(effect, damageToAdd);
          countersEffect.target = cardList;
          store.reduceEffect(state, countersEffect);
        }
      });
    }

    // Blizzard - deal 10 damage to each benched Pokémon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}
