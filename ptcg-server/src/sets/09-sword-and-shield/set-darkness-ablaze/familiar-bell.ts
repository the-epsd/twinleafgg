import { TrainerCard } from '../../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PokemonCard, StoreLike, State, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class FamiliarBell extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'D';
  public set: string = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '161';
  public name: string = 'Familiar Bell';
  public fullName: string = 'Familiar Bell DAA';
  public text: string =
    'Search your deck for a Pokémon with the same name as a Pokémon in your discard pile, reveal it, and put it into your hand. Then, shuffle your deck. You may play any number of Item cards during your turn.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const discardedPokemonNames = new Set<string>();
    player.discard.cards.forEach((c) => {
      if (c instanceof PokemonCard) {
        discardedPokemonNames.add(c.name);
      }
    });

    if (discardedPokemonNames.size === 0) {
      return false;
    }

    const hasMatchInDeck = player.deck.cards.some(
      (c) => c instanceof PokemonCard && discardedPokemonNames.has(c.name),
    );

    if (!hasMatchInDeck) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Find all Pokemon names in the discard pile
      const discardedPokemonNames = new Set<string>();
      player.discard.cards.forEach((c) => {
        if (c instanceof PokemonCard) {
          discardedPokemonNames.add(c.name);
        }
      });

      if (discardedPokemonNames.size === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Check that deck has at least one matching Pokemon
      const hasMatchInDeck = player.deck.cards.some(
        (c) => c instanceof PokemonCard && discardedPokemonNames.has(c.name),
      );

      if (!hasMatchInDeck) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [this],
        sourceCard: this,
      });

      // Block deck cards that don't match any discard Pokemon name
      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (!(c instanceof PokemonCard) || !discardedPokemonNames.has(c.name)) {
          blocked.push(index);
        }
      });

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.POKEMON },
        { min: 1, max: 1, allowCancel: false, blocked },
      );
    }

    return state;
  }
}
