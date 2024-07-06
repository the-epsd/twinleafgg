import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { Card, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, GameError, PlayerType, PokemonCard, SelectPrompt, SlotType, StateUtils } from '../../game';

export class Serena extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '164';

  public regulationMark = 'F';

  public name: string = 'Serena';

  public fullName: string = 'Serena SIT';

  public text: string =
    'Choose 1:' +
    '• Discard up to 3 cards from your hand. (You must discard at least 1 card.) If you do, draw cards until you have 5 cards in your hand.' +
    '• Switch 1 of your opponent\'s Benched Pokémon V with their Active Pokémon.. Shuffle the other cards back into your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.DISCARD_AND_DRAW,
          action: () => {

            let cards: Card[] = [];

            return store.prompt(state, new ChooseCardsPrompt(
              player.id,
              GameMessage.CHOOSE_CARD_TO_DISCARD,
              player.hand,
              {},
              { min: 1, max: 3, allowCancel: true }
            ), selected => {
              cards = selected || [];
              player.hand.moveCardsTo(cards, player.discard);


              while (player.hand.cards.length < 5) {
                player.deck.moveTo(player.hand, 1);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);

              }
              return state;
            });
          }
        },
        {
          message: GameMessage.SWITCH_POKEMON,
          action: () => {

            const blocked: CardTarget[] = [];
            opponent.bench.forEach((card, index) => {
              if (card instanceof PokemonCard && !(card.tags.includes(CardTag.POKEMON_V) || card.tags.includes(CardTag.POKEMON_VMAX) || card.tags.includes(CardTag.POKEMON_VSTAR))) {
                blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
              }
            });

            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_SWITCH,
              PlayerType.TOP_PLAYER,
              [SlotType.BENCH],
              { allowCancel: false, blocked }
            ), result => {
              const cardList = result[0];
              opponent.switchPokemon(cardList);
              player.supporter.moveCardTo(effect.trainerCard, player.discard);
              return state;
            });
          }
        }
      ];

      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        options.splice(1, 0);
      }

      let cards: Card[] = [];

      cards = player.hand.cards;
      if (cards.length < 1) {
        options.splice(0, 1);
      }

      if (player.deck.cards.length === 0) {
        options.splice(0, 1);
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