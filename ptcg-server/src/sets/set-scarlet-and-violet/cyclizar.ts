import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Cyclizar extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 110;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ ];

  public attacks = [
    {
      name: 'Touring',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Draw 2 cards.'
    },
    {
      name: 'Speed Attack',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '164';

  public name: string = 'Cyclizar';

  public fullName: string = 'Cyclizar SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      
      const player = effect.player;

      player.deck.moveTo(player.hand, 2);

    }
    return state;
  }
}