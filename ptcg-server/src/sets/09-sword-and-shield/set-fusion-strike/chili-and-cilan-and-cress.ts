import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag, SuperType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { StoreLike, State, Player } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SHUFFLE_DECK, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ChiliAndCilanAndCress extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'E';
  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '227';
  public name: string = 'Chili & Cilan & Cress';
  public fullName: string = 'Chili & Cilan & Cress FST 227';
  public text: string =
    'Search your deck for up to 3 Fusion Strike Pokémon, reveal them, and put them into your hand. Then, shuffle your deck. You may play only 1 Supporter card during your turn.';
  protected _tags = [CardTag.FUSION_STRIKE];

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Find Fusion Strike Pokemon in deck
      const fusionStrikePokemon = player.deck.cards.filter(
        (c) => c instanceof PokemonCard && c.hasTag(CardTag.FUSION_STRIKE),
      );

      if (fusionStrikePokemon.length === 0) {
        SHUFFLE_DECK(store, state, player);
        return state;
      }

      // Block all non-Fusion-Strike Pokemon
      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard) || !card.hasTag(CardTag.FUSION_STRIKE)) {
          blocked.push(index);
        }
      });

      const max = Math.min(3, fusionStrikePokemon.length);

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.POKEMON },
        { min: 0, max, allowCancel: false, blocked },
      );
    }

    return state;
  }
}
