import { Card, ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PokemonCard, StateUtils } from '../../game';
import { CardTag, EnergyType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_CARDS_FROM_YOUR_HAND } from '../../game/store/prefabs/trainer-prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class HolonFarmer extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public tags = [CardTag.DELTA_SPECIES];
  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Holon Farmer';
  public fullName: string = 'Holon Farmer DS';

  public text: string =
    'Discard a card from your hand. If you can\'t discard a card from your hand, you can\'t play this card.\n\nSearch your discard pile for 3 basic Energy cards and any combination of 3 Basic Pokémon or Evolution cards, show them to your opponent, and put them on top of your deck. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      DISCARD_X_CARDS_FROM_YOUR_HAND(effect, store, state, 1, 1);

      const opponent = StateUtils.getOpponent(state, player);
      let cards: Card[] = [];

      let pokemons = 0;
      let energies = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
          energies += 1;
        } else if (c instanceof PokemonCard) {
          pokemons += 1;
        } else {
          blocked.push(index);
        }
      });

      const maxPokemons = Math.min(pokemons, 3);
      const maxEnergies = Math.min(energies, 3);
      const count = maxPokemons + maxEnergies;

      if (count === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.discard,
        {},
        { min: count, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies }
      ), selected => {
        cards = selected || [];

        player.discard.moveCardsTo(cards, player.deck);

        if (cards.length > 0) {
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards)
        }
        SHUFFLE_DECK(store, state, player);

        player.supporter.moveCardTo(effect.trainerCard, player.discard);
      });
    }

    return state;
  }
}
