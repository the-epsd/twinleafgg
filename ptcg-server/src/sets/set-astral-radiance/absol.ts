import { State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Absol extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 100;

  public attacks = [
    {
      name: 'Swirling Diaster',
      cost: [D],
      damage: 0,
      text: 'This attack does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Claw Rend',
      cost: [D, C],
      damage: 50,
      text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 70 more damage.'
    }
  ];

  public weakness = [{ type: G }];
  public retreat = [C];
  public set: string = 'ASR';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Absol';
  public fullName: string = 'Absol ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Swirling Diaster
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const activeDamageEffect = new DealDamageEffect(effect, 10);
      activeDamageEffect.target = opponent.active;
      store.reduceEffect(state, activeDamageEffect);


      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
      return state;
    }

    //Claw Rend
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.damage > 0) {
        effect.damage += 70;
      }

      return state;
    }

    return state;
  }
}