import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Primeape extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 90;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = 'Mankey';

  public attacks = [
    {
      name: 'Raging Punch',
      cost: [CardType.FIGHTING],
      damage: 70,
      text: 'This Pokemon also does 10 damage to itself.'
    }
  ];
  
  public regulationMark: string = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '108';
  public name: string = 'Primeape';
  public fullName: string = 'Primeape SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 20);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    
    return state;
  }
}
