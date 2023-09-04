import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { Card, ChooseCardsPrompt, PokemonCardList, ShuffleDeckPrompt } from '../../game';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

export class Artazon extends TrainerCard {
  trainerType = TrainerType.STADIUM;
  set = 'PAL';
  name = 'Artazon';
  fullName = 'Artazon PAL';
  text = 'Once during each player\'s turn, that player may search their ' +
  'deck for a Basic Pokémon that doesn\'t have a Rule Box ' +
  'and put it onto their Bench. Then, that player shuffles their deck. ' +
  '(Pokémon ex, Pokémon V, etc. have Rule Boxes.)';
    
  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      return this.useStadium(store, state, effect);
      
    }
    return state;
  }
    
  useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State {
    const player = effect.player;
    
    const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

    if (player.deck.cards.length === 0) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (slots.length < 0) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    } else {
      // handle no open slots
   

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 1, max: 1, allowCancel: true }
      ), selectedCards => {
        cards = selectedCards || [];

        if (cards[0].tags.includes(CardTag.POKEMON_V) || 
      cards[0].tags.includes(CardTag.POKEMON_VSTAR) ||
      cards[0].tags.includes(CardTag.POKEMON_VMAX)  ||
      cards[0].tags.includes(CardTag.POKEMON_EX)    ||
      cards[0].tags.includes(CardTag.RADIANT)
        ) 
      
        {
          throw new GameError(GameMessage.INVALID_TARGET);
        }
        else {
          cards.forEach((card, index) => {
            player.deck.moveCardTo(card, slots[index]);
            slots[index].pokemonPlayedTurn = state.turn;
          });

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
          });
        }
      });
    }
  }
}