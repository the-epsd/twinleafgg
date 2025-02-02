import { State } from '../../game';
import { StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { SpecialCondition } from '../../game/store/card/card-types';

export class Bellsprout extends PokemonCard {
  public regulationMark = 'E';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 50;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    {
      name: 'Venoshock',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: 'If your opponent\'s Active Pokémon is Poisoned, this attack' + 
                'does 40 more damage.'
    }
  ];
  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '1';

  public name: string = 'Bellsprout';

  public fullName: string = 'Bellsprout BST';

  reduceEffect(store: StoreLike, state: State, effect: Effect) {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      let damage = 10;
      if (effect.opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        damage += 40;
      }
      effect.damage = damage;
    }
    return state; 
  }
}
