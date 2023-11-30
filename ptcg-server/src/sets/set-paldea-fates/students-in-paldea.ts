import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { Card, ChooseCardsPrompt, GameMessage, PokemonCard, ShowCardsPrompt, ShuffleDeckPrompt, StateUtils } from '../../game';

export class StudentsInPaldea extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'G';
  
  public set2: string = 'shinytreasuresex';
  
  public setNumber: string = '178';
  
  public set = 'SV4';
  
  public name = 'Students In Paldea';
  
  public fullName = 'Students In Paldea SV4';

  public text: string =
    'Search your deck for a Pokémon that doesn\'t have a Rule Box, reveal it, and put it into your hand. For each other Students in Paldea in your discard pile, you may search your deck for another Pokémon that doesn’t have a Rule Box. Then, shuffle your deck. (Pokémon ex, Pokémon V, etc. have Rule Boxes.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const cardsInDiscard = effect.player.discard.cards.filter(c => c.name === 'Students In Paldea');
      const cardsToTake = 1 + cardsInDiscard.length;
      
      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard && card.tags.includes(CardTag.POKEMON_V) && card.tags.includes(CardTag.POKEMON_ex) && card.tags.includes(CardTag.POKEMON_VMAX) && card.tags.includes(CardTag.POKEMON_VSTAR) && card.tags.includes(CardTag.RADIANT))) {
          blocked.push(index);
        } 
      });


      let cards: Card[] = [];
      state = store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 0, max: cardsToTake, allowCancel: true, blocked }
      ), selected => {
        cards = selected || [];

        state = store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards
        ), () => {

          state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
          });
        });
        return state;
      });
      return state;
    }
    return state;
  }
}