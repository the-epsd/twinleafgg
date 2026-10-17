import { CardType, EnergyType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardToHandEffect } from '../../../game/store/effects/play-card-effects';
import {
  EnergyCard,
  GameError,
  Player,
  PokemonCard,
  pokemonHasCardType,
  GameMessage,
  TrainerCard,
  State,
  StoreLike,
} from '../../../game';
import {
  MOVE_CARDS,
  SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Nessa extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'D';
  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '157';
  public name: string = 'Nessa';
  public fullName: string = 'Nessa VIV';
  public text: string =
    'Put up to 4 in any combination of [W] Pokémon and [W] Energy cards from your discard pile into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Check if DiscardToHandEffect is prevented
      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);

      if (discardEffect.preventDefault) {
        // If prevented, just discard the card and return
        return state;
      }

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      let pokemons = 0;
      let energies = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (
          c instanceof EnergyCard &&
          c.energyType === EnergyType.BASIC &&
          c.name === 'Water Energy'
        ) {
          energies += 1;
        } else if (c instanceof PokemonCard && pokemonHasCardType(c, CardType.WATER)) {
          pokemons += 1;
        } else {
          blocked.push(index);
        }
      });

      const maxPokemons = Math.min(pokemons, 4);
      const maxEnergies = Math.min(energies, 4);

      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        {},
        { min: 0, max: 4, allowCancel: false, blocked, maxPokemons, maxEnergies },
      );
    }

    return state;
  }
}
