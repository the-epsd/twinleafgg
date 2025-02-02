import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Braixen extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Fennekin';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 90;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Combustion',
      cost: [CardType.FIRE],
      damage: 30,
      text: ''
    },
    {
      name: 'Flare Parade',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      damageCalculation: 'x',
      text: 'This attack does 60 damage for each Serena card in your discard pile.'
    }
  ];

  public regulationMark = 'F';

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '26';

  public name: string = 'Braixen';

  public fullName: string = 'Braixen SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const cards = effect.player.discard.cards.filter(c => c.name === 'Serena');
      effect.damage = cards.length * 60;
      return state;
    }
    return state;
  }
}