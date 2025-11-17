import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND } from '../../game/store/prefabs/prefabs';
import { PokemonCard } from '../../game';

function hasRuleBox(card: PokemonCard): boolean {
  return card.tags.includes(CardTag.POKEMON_ex) ||
    card.tags.includes(CardTag.POKEMON_EX) ||
    card.tags.includes(CardTag.POKEMON_V) ||
    card.tags.includes(CardTag.POKEMON_VMAX) ||
    card.tags.includes(CardTag.POKEMON_VSTAR) ||
    card.tags.includes(CardTag.POKEMON_VUNION) ||
    card.tags.includes(CardTag.POKEMON_GX) ||
    card.tags.includes(CardTag.TAG_TEAM) ||
    card.tags.includes(CardTag.POKEMON_LV_X) ||
    card.tags.includes(CardTag.BREAK) ||
    card.tags.includes(CardTag.PRISM_STAR) ||
    card.tags.includes(CardTag.MEGA) ||
    card.tags.includes(CardTag.POKEMON_SV_MEGA) ||
    card.tags.includes(CardTag.LEGEND) ||
    card.tags.includes(CardTag.RADIANT);
}

export class PokePad extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'MC';
  public setNumber: string = '662';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Poké Pad';
  public fullName: string = 'Poké Pad MC';
  public text: string = 'Search your deck for a Pokemon without a Rule Box, reveal it, and put it into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard) {
          // Block Pokemon cards with Rule Box tags
          if (hasRuleBox(card)) {
            blocked.push(index);
          }
        } else {
          // Block non-Pokemon cards
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(
        store, state, effect.player, {}, { min: 0, max: 1, blocked }
      );

      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    return state;
  }
}

