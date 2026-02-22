import { ChoosePokemonPrompt, GameError, PlayerType, SelectPrompt, ShuffleDeckPrompt, SlotType } from '../../game';
import { GameMessage } from '../../game/game-message';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CLEAN_UP_SUPPORTER, DRAW_CARDS, MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TateAndLiza extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CES';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '148';

  public name: string = 'Tate & Liza';

  public fullName: string = 'Tate & Liza CES';

  public text: string =
    'Choose 1:' +
    '• Shuffle your hand into your deck. Then, draw 5 cards.' +
    '• Switch your Active Pokémon with 1 of your Benched Pokémon.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.SWITCH_POKEMON,
          action: () => {
            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_SWITCH,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.BENCH],
              { allowCancel: false }
            ), result => {
              const cardList = result[0];
              player.switchPokemon(cardList, store, state);
              CLEAN_UP_SUPPORTER(effect, player);
            });
          }
        },
        {
          message: GameMessage.SHUFFLE_YOUR_HAND,
          action: () => {

            if (player.hand.cards.length > 0) {
              MOVE_CARDS(store, state, player.hand, player.deck, { cards: player.hand.cards.filter(c => c !== this), sourceCard: this });
            }

            store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });

            DRAW_CARDS(player, 5);
            CLEAN_UP_SUPPORTER(effect, player);
          }
        }
      ];

      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        options.splice(0, 1);
      }

      if (player.deck.cards.length === 0) {
        options.splice(1, 1);
      }

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options.map(opt => opt.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        option.action();
      });
    }
    return state;
  }



}