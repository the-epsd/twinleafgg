import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Frigibax extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Collect',
      cost: [ CardType.WATER ],
      damage: 0,
      text: 'Draw a card.'
    },
    {
      name: 'Bite',
      cost: [ CardType.WATER, CardType.COLORLESS ],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'PAF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '17';

  public name: string = 'Frigibax';

  public fullName: string = 'Frigibax PAF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 1);
      return state;
    }

    return state;
  }

}

