import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Deino extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C];

  public attacks = [
    {
      name: 'Stomp Off',
      cost: [D],
      damage: 0,
      text: 'Discard the top card of your opponent\'s deck.'
    },
    {
      name: 'Bite',
      cost: [D, C],
      damage: 20,
      text: ''
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '117';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Deino';
  public fullName: string = 'Deino SV8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.deck.moveTo(opponent.discard, 1);
    }

    return state;
  }
}
