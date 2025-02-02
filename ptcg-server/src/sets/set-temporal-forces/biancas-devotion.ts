import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { EnergyCard, GameError, GameMessage, PlayerType } from '../..';
import { HealEffect } from '../../game/store/effects/game-effects';

export class BiancasDevotion extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '142';

  public regulationMark = 'H';

  public name: string = 'Bianca\'s Devotion';

  public fullName: string = 'Bianca\'s Devotion TEF';

  public text: string = 'Heal all damage from 1 of your Pokémon that has 30 HP or less remaining.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {

        const pokemon = cardList.getPokemonCard();

        if (pokemon && pokemon.hp <= 30) {
          return state;
        }

        const healEffect = new HealEffect(player, cardList, cardList.damage);
        state = store.reduceEffect(state, healEffect);
        const cards = cardList.cards.filter(c => c instanceof EnergyCard);
        cardList.moveCardsTo(cards, player.discard);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        
      });
      return state;
    }
    return state;
  }

}