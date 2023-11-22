import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, PowerType } from '../../game';
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
      name: 'Spinning Attack',
      cost: [ CardType.WATER, CardType.WATER, CardType.COLORLESS ],
      damage: 110,
      text: 'This attack\'s damage isn\'t affected by Weakness.'
    }
  ];
  
  public set: string = 'LOR';

  public set2: string = 'lostorigin';

  public setNumber: string = '50';
  
  public name: string = 'Cramorant';
  
  public fullName: string = 'Cramorant LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
  
      if (player.lostzone.cards.length >= 4) {
        const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
        state = store.reduceEffect(state, checkCost);
        this.attacks[0].cost = [];
      }

      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
  
        effect.ignoreWeakness = true;
        return state;
      }
    }
    return state;
  }
}