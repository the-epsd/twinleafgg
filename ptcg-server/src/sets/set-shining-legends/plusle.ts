import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Plusle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: 20 }];
  public retreat = [CardType.COLORLESS];
  
  public attacks = [{
    name: 'Tag Team Boost',
    cost: [CardType.LIGHTNING],
    damage: 10,
    damageCalculation: '+',
    text: 'If Minun is on your Bench, this attack does 50 more damage.',
  }]

  public set: string = 'SLG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Plusle';
  public fullName: string = 'Plusle SLG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      
      let minunIsOnBench = player.bench.some(c => c.cards.some(card => card.name === 'Minun'));
      if (minunIsOnBench) {
        effect.damage += 50;
      }
      
      return state;
    }

    return state;
  }
}
