import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

// LOR Hisuian Arcanine 84 (https://limitlesstcg.com/cards/LOR/84)
export class HisuianArcanine extends PokemonCard {

  public tags = [];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Hisuian Growlithe';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 130;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Very Vulnerable',
      cost: [],
      damage: 10,
      text: 'If you have no cards in your hand, this attack does 150 more damage.'
    },

    {
      name: 'Sharp Fang',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'LOR';

  public name: string = 'Hisuian Arcanine';

  public fullName: string = 'Hisuian Arcanine LOR';

  public setNumber: string = '84';

  public regulationMark: string = 'F';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Very Vulnerable
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.hand.cards.length === 0) {
        effect.damage += 150;
      }
    }
    return state;
  }
}