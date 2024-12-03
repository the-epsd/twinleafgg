import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { EnergyCard, PlayerType } from '../..';
import { HealEffect } from '../../game/store/effects/game-effects';

export class PokemonCenter extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '85';

  public name: string = 'Pokémon Center';

  public fullName: string = 'Pokémon Center BS';

  public text: string = 'Remove all damage counters from all of your own Pokémon with damage counters on them, then discard all Energy cards attached to those Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.damage > 0) {
          const healAmount = cardList.damage;
          const healEffect = new HealEffect(player, cardList, healAmount);
          state = store.reduceEffect(state, healEffect);

          // Only discard energy if healing occurred
          if (healAmount > 0) {
            const cards = cardList.cards.filter(c => c instanceof EnergyCard);
            cardList.moveCardsTo(cards, player.discard);
          }
        }
      });
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      return state;
    }
    return state;
  }
}