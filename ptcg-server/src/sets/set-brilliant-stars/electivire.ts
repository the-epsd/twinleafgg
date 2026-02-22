import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Electivire extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Electabuzz';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Explosive Bolt',
      cost: [CardType.LIGHTNING],
      damage: 30,
      damageCalculation: '+',
      text: 'If any of your Benched Magmortar have any damage counters on them, this attack does 90 more damage.'
    },
    {
      name: 'High-Voltage Current',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 50 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'BRS';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '47';

  public name: string = 'Electivire';

  public fullName: string = 'Electivire BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;

      let isMagmortarWithDamageInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Magmortar' && cardList.damage > 0) {
          isMagmortarWithDamageInPlay = true;
        }
      });

      if (isMagmortarWithDamageInPlay) {
        effect.damage += 90;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const activeDamageEffect = new DealDamageEffect(effect, 50);
      store.reduceEffect(state, activeDamageEffect);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 50);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
}
