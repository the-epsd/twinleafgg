import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage, PokemonCard, ShowCardsPrompt, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Hoothoot extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = C;

  public weakness = [{ type: L }];

  public resistance = [{ type: F, value: -30 }];

  public hp: number = 70;

  public retreat = [C];

  public attacks = [
    {
      name: 'Silent Wing',
      cost: [C, C],
      damage: 20,
      text: 'Your opponent reveals their hand.'
    }
  ];

  public regulationMark = 'H';

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '126';

  public name: string = 'Hoothoot';

  public fullName: string = 'Hoothoot TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponent.hand.cards
      ), () => state);
    }
    return state;
  }

}