import { StoreLike, State, GameError, GameMessage, StateUtils, SelectPrompt, GameLog } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_UP_TO_X_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';

export class TeamGalacticsWager extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '115';
  public name: string = 'Team Galactic\'s Wager';
  public fullName: string = 'Team Galactic\'s Wager MT';
  public text = 'Each player shuffles his or her hand into his or her deck, and you and your opponent play "Rock-Paper-Scissors." The player who wins draws up to 6 cards. The player who loses draws up to 3 cards. (You draw your cards first.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      effect.preventDefault = true;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      const cards = player.hand.cards.filter(c => c !== this);
      const opponentCards = opponent.hand.cards.filter(c => c !== this);

      if (cards.length === 0 && player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardsTo(cards, player.deck);
      opponent.hand.moveCardsTo(opponentCards, opponent.deck);

      SHUFFLE_DECK(store, state, player);
      SHUFFLE_DECK(store, state, opponent);

      const options = [
        { value: 'Rock', message: 'Rock' },
        { value: 'Paper', message: 'Paper' },
        { value: 'Scissors', message: 'Scissors' }
      ];

      // Default to player losing
      let maxPlayerDraw = 3;
      let maxOpponentDraw = 6;

      // simultaneous prompt showing gaming
      store.prompt(state, [
        new SelectPrompt(
          player.id, GameMessage.CHOOSE_OPTION,
          options.map(c => c.message),
          { allowCancel: false }
        ),
        new SelectPrompt(
          opponent.id, GameMessage.CHOOSE_OPTION,
          options.map(c => c.message),
          { allowCancel: false }
        ),
      ], results => {
        // variable time
        const playerChosenValue = results[0];
        const opponentChosenValue = results[1];
        // outputting what both players chose
        store.log(state, GameLog.LOG_PLAYER_CHOOSES, { name: player.name, string: options[playerChosenValue].message });
        store.log(state, GameLog.LOG_PLAYER_CHOOSES, { name: opponent.name, string: options[opponentChosenValue].message });
        // if they tie, restart it
        if (playerChosenValue === opponentChosenValue) { return this.reduceEffect(store, state, effect); }

        // Gotta make the win conditions (where player wins)
        if ((playerChosenValue === 1 && opponentChosenValue === 0)
          || (playerChosenValue === 2 && opponentChosenValue === 1)
          || (playerChosenValue === 0 && opponentChosenValue === 2)) {
          maxPlayerDraw = 6;
          maxOpponentDraw = 3;

          DRAW_UP_TO_X_CARDS(store, state, player, maxPlayerDraw);
          DRAW_UP_TO_X_CARDS(store, state, opponent, maxOpponentDraw);
        }
      });

      player.supporter.moveCardTo(effect.trainerCard, player.discard);

    }

    return state;
  }
}