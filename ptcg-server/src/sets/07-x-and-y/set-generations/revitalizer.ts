import { CardType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardToHandEffect } from '../../../game/store/effects/play-card-effects';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, PokemonCard, pokemonHasCardType } from '../../../game';
import { MOVE_CARDS, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Revitalizer extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'GEN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Revitalizer';
  public fullName: string = 'Revitalizer GEN';
  public text: string = 'Put 2 [G] Pokémon from your discard pile into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (!player.discard.cards.some((c) => c instanceof PokemonCard && pokemonHasCardType(c, CardType.GRASS))) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Block everything except [G] Pokémon
      let pokemonInDiscard = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (c instanceof PokemonCard && pokemonHasCardType(c, CardType.GRASS)) {
          pokemonInDiscard += 1;
        } else {
          blocked.push(index);
        }
      });

      // Check if DiscardToHandEffect is prevented
      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);

      if (discardEffect.preventDefault) {
        return state;
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.POKEMON },
        { min: Math.min(pokemonInDiscard, 2), max: 2, allowCancel: false, blocked },
      );
    }

    return state;
  }
}
