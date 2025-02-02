import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Togetic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Togepi';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Shared Peace',
      cost: [ C ],
      damage: 0,
      text: 'Each player draws 3 cards.'
    },
    {
      name: 'Speed Dive',
      cost: [ C, C ],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'OBF';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Togetic';
  public fullName: string = 'Togetic OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shared Peace
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.deck.moveTo(player.hand, 3);
      opponent.deck.moveTo(opponent.hand, 3);
    }

    return state;
  }
}
