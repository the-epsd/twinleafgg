import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, GameError, PokemonCard } from '../../game';

export class Thorton extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'LOR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '167';

  public name: string = 'Thorton';

  public fullName: string = 'Thorton LOR';

  public text: string =
    'Choose a Basic Pokémon in your discard pile and switch it with 1 of your Basic Pokémon in play. Any attached cards, damage counters, Special Conditions, turns in play, and any other effects remain on the new Pokémon. You may play only 1 Supporter card during your turn.';

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
  
      const hasBasicInDiscard = player.discard.cards.some(c => {
        return c instanceof PokemonCard && Stage.BASIC;
      });
      if (!hasBasicInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.discard,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min: 1, max: 1, allowCancel: false }
      ), selectedCards => {
        cards = selectedCards || [];
        
    
        cards.forEach((card, index) => {
          player.active.moveCardTo(card, player.discard);
          player.discard.moveCardTo(card, player.active);

        });
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        
      }
      );
  
    }
    return state;
  }

}
