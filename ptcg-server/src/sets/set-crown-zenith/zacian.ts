import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class Zacian extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.METAL;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Battle Legion',
    cost: [CardType.METAL],
    damage: 20,
    damageCalculation: '+',
    text: 'This attack does 10 more damage for each of your Benched Pokémon. This attack\'s damage '
      + 'isn\'t affected by Weakness or by any effects on your opponent\'s Active Pokémon.'
  },
  {
    name: 'Slicing Blade',
    cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
    damage: 100,
    text: ''
  }];

  public set = 'CRZ';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name = 'Zacian';
  public fullName = 'Zacian CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      //Get number of benched pokemon
      const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      const totalBenched = playerBenched;
      const damage = 20 + (totalBenched * 10);

      effect.damage = 0;
      effect.ignoreWeakness = true;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    return state;
  }
}