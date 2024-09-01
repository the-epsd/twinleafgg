import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Annihilape extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 140;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Primeape';

  public attacks = [
    {
      name: 'Rage Fist',
      cost: [CardType.FIGHTING],
      damage: 70,
      damageCalculation: 'x',
      text: 'This attack does 70 damage for each Prize card your opponent has taken.'
    },
    {
      name: 'Dynamite Punch',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: 170,
      text: 'This Pokemon also does 10 damage to itself.'
    }
  ];

  public regulationMark: string = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Annihilape';
  public fullName: string = 'Annihilape SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const prizesTaken = 6 - opponent.getPrizeLeft();

      const damagePerPrize = 70;

      effect.damage = this.attacks[0].damage + (prizesTaken * damagePerPrize);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 50);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
