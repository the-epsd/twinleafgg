import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Croconaw extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Totodile';
  public cardType: CardType = CardType.WATER;
  public hp: number = 90;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    },
    {
      name: 'Sweep Away',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 90,
      text: 'Discard the top 3 cards of your deck.'
    }
  ];

  public set: string = 'DRM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Croconaw';
  public fullName: string = 'Croconaw DRM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      // Discard 3 cards from your deck 
      player.deck.moveTo(player.discard, 3);
      return state;
    }

    return state;
  }

}

