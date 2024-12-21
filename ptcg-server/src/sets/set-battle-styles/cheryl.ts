import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { EnergyCard, PlayerType } from '../..';
import { HealEffect } from '../../game/store/effects/game-effects';

export class Cheryl extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '123';

  public regulationMark = 'E';

  public name: string = 'Cheryl';

  public fullName: string = 'Cheryl BST';

  public text: string = 'Heal all damage from each of your Evolution Pokémon. If you do, discard all Energy from the Pokémon that were healed in this way.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {

        const pokemon = cardList.getPokemonCard();

        if (pokemon?.stage === Stage.BASIC) {
          return state;
        }

        if (cardList.damage > 0) {
          const healEffect = new HealEffect(player, cardList, cardList.damage);
          state = store.reduceEffect(state, healEffect);
          const cards = cardList.cards.filter(c => c instanceof EnergyCard);
          cardList.moveCardsTo(cards, player.discard);
        }


      });
      return state;
    }
    return state;
  }

}