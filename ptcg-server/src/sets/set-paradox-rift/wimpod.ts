import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, CoinFlipPrompt, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Wimpod extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Sneaky Snacking',
      cost: [C],
      damage: 0,
      text: 'Flip a coin. If heads, discard a random card from your opponent\'s hand.'
    },
    {
      name: 'Ram',
      cost: [W, C, C],
      damage: 30,
      text: ''
    },
  ];

  public set: string = 'PAR';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Wimpod';
  public fullName: string = 'Wimpod PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sneaky Snacking
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0){
        return state;
      }

      store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === false) {
          return state;
        }
      });

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { allowCancel: false, min: 1, max: 1, isSecret: true }
      ), cards => {
        cards = cards || [];

        opponent.hand.moveCardsTo(cards, opponent.discard);
      });
    }

    return state;
  }
}
