import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Ralts extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Collect',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Draw a card.'
    },
    {
      name: 'Headbutt',
      cost: [CardType.PSYCHIC],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'M1S';

  public name: string = 'Ralts';

  public fullName: string = 'Ralts M1S';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 1);
    }

    return state;
  }
} 