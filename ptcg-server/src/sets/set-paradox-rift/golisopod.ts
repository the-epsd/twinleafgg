import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Golisopod extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wimpod';
  public cardType: CardType = W;
  public hp: number = 140;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Powerful Cross',
      cost: [W],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each card in your opponent\'s hand.'
    },
    {
      name: 'Waterfall',
      cost: [W, W, C],
      damage: 130,
      text: ''
    },
  ];

  public set: string = 'PAR';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Golisopod';
  public fullName: string = 'Golisopod PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Powerful Cross
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.damage = (20 * opponent.hand.cards.length);
    }

    return state;
  }
}
