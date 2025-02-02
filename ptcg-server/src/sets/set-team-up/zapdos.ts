import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Zapdos extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Thunderous Assault',
      cost: [CardType.LIGHTNING],
      damage: 10,
      text: 'If this Pokémon was on the Bench and became your Active Pokémon this turn, this attack does 70 more damage. This attack\'s damage isn\'t affected by Weakness.'
    }
  ];

  public set: string = 'TEU';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '40';
  
  public name: string = 'Zapdos';
  
  public fullName: string = 'Zapdos TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  
    if (effect instanceof EndTurnEffect) {
      this.movedToActiveThisTurn = false; 
    }
    
    if (effect instanceof RetreatEffect && effect.player.active.getPokemonCard() !== this) {
      this.movedToActiveThisTurn = true;
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreWeakness = true;
      if (this.movedToActiveThisTurn) {
        effect.damage += 70;
      }
    }
    return state;
  }
}