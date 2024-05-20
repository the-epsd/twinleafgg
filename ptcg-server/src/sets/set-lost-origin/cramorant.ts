import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, PowerType, StateUtils } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';

export class Cramorant extends PokemonCard {
  
  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';
  
  public cardType: CardType = CardType.WATER;
  
  public hp: number = 110;
  
  public weakness = [{ type: CardType.LIGHTNING }];
  
  public retreat = [ CardType.COLORLESS ];
  
  public powers = [{
    name: 'Lost Provisions',
    powerType: PowerType.ABILITY,
    text: 'If you have 4 or more cards in the Lost Zone, ignore all Energy in this Pokémon\'s attack costs.'
  }];
  
  public attacks = [
    {
      name: 'Spit Innocently',
      cost: [ CardType.WATER, CardType.WATER, CardType.COLORLESS ],
      damage: 110,
      text: 'This attack\'s damage isn\'t affected by Weakness.'
    }
  ];
  
  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '50';
  
  public name: string = 'Cramorant';
  
  public fullName: string = 'Cramorant LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.lostzone.cards.length <= 3) {
        return state;
      }
  
      if (player.lostzone.cards.length >= 4) {
        try {
          const powerEffect = new PowerEffect(opponent, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }
        this.attacks.forEach(attack => {
          attack.cost = [];
        });
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      effect.ignoreWeakness = true;
      
    }
    return state;
  }
}