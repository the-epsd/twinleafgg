import { CoinFlipPrompt, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARD_TO, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Houndstone extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Greavard';
  public cardType: CardType = P;
  public hp: number = 140;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Horror Bite',
    cost: [P],
    damage: 30,
    text: 'Flip a coin until you get tails. For each heads, choose a random card from your opponent\'s hand. Your opponent reveals those cards and shuffles them into their deck.'
  },
  {
    name: 'Hammer In',
    cost: [P, P, C],
    damage: 130,
    text: ''
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Houndstone';
  public fullName: string = 'Houndstone M1S';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let numCards = 0;
      const flipCoin = (heads: number = 0): State => {
        return store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            return flipCoin(heads + 1);
          }
          numCards = heads;
          for (let i = 0; i < numCards; i++) {
            if (opponent.hand.cards.length > 0) {
              const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
              const randomCard = opponent.hand.cards[randomIndex];
              SHOW_CARDS_TO_PLAYER(store, state, player, [randomCard]);
              MOVE_CARD_TO(state, randomCard, opponent.deck);
              SHUFFLE_DECK(store, state, opponent);
            }
          }
          return state;
        });
      };
      return flipCoin();
    }

    return state;
  }
} 