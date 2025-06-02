import { TrainerCard, TrainerType, StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage, CardTag, EnergyCard, EnergyType, GameError, PokemonCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { BLOCK_IF_DECK_EMPTY, SHOW_CARDS_TO_PLAYER, MOVE_CARD_TO, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class EthansAdventure extends TrainerCard {

  public trainerType = TrainerType.SUPPORTER;

  public regulationMark = 'I';

  public cardImage: string = 'assets/cardback.png';

  public set = 'DRI';

  public setNumber: string = '165';

  public name = 'Ethan\'s Adventure';

  public fullName = 'Ethan\'s Adventure DRI';

  public text = 'Search your deck for up to 3 in any combination of Ethan\'s Pokémon and Basic [R] Energy, reveal them, and put them into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(this, player.supporter);
      BLOCK_IF_DECK_EMPTY(player);

      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        const isPokemon = c instanceof PokemonCard && c.tags.includes(CardTag.ETHANS);
        const isBasicEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Fire Energy';
        if (!isPokemon && !isBasicEnergy) {
          blocked.push(index);
        }
      });

      effect.preventDefault = true;

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.deck,
        {},
        { min: 0, max: 3, allowCancel: false, blocked }
      ), cards => {
        if (!cards || cards.length === 0) {
          return state;
        }

        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        cards.forEach(card => MOVE_CARD_TO(state, card, player.hand));
        SHUFFLE_DECK(store, state, player);
      });

      player.supporter.moveCardTo(this, player.discard);
    }

    return state;
  }
}
