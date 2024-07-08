import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Sudowoodo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 90;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Watch and Learn',
    cost: [CardType.FIGHTING, CardType.COLORLESS],
    damage: 0,
    text: 'If your opponent\'s Pokémon used an attack during his or her last turn, use it as this attack.'
  }];

  public set: string = 'BKP';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sudowoodo';
  public fullName: string = 'Sudowoodo BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const lastAttack = state.lastAttack;

      if (!lastAttack || lastAttack.name === 'Copycat' || lastAttack.name === 'Watch and Learn') {
        return state;
      }

      const attackEffect = new AttackEffect(player, opponent, lastAttack);
      store.reduceEffect(state, attackEffect);

      if (attackEffect.damage > 0) {
        const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
      }

      return state;
    }

    return state;
  }
}