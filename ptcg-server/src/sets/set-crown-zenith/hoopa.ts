import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Hoopa extends PokemonCard {

  public regulationMark = 'D';
  
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 120;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Assault Gate',
      cost: [CardType.DARK],
      damage: 90,
      text: 'If this Pokémon didn\'t move from the Bench to the Active Spot this turn, this attack does nothing. This attack\'s damage isn\'t affected by Weakness.'
    }
  ];

  public set: string = 'CRZ';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '83';

  public name: string = 'Hoopa';

  public fullName: string = 'Hoopa CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      this.movedToActiveThisTurn = false;
      console.log('movedToActiveThisTurn = false');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (!this.movedToActiveThisTurn) {
        effect.damage = 0;
        return state;
      }
      effect.ignoreWeakness = true;
      effect.damage = 90;
    }
    return state;
  }
}
