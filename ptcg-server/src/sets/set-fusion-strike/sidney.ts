import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import {StateUtils, GameMessage, ChooseCardsPrompt, GameError } from '../../game';
import { CardList } from '../../game/store/state/card-list';


export class Sidney extends TrainerCard {

  public regulationMark = 'E';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '241';

  public name: string = 'Sidney';

  public fullName: string = 'Sidney FST';

  public text: string =
    'Your opponent reveals their hand. Discard up to 2 in any combination of Pokémon Tool cards, Special Energy cards, and Stadium cards from it.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      // Build a list of eligible cards: Pokémon Tools, Stadiums and Special Energy
      const candidates = new CardList();
      candidates.cards = opponent.hand.cards.filter(c => {
        if (c.superType === SuperType.TRAINER) {
          return (c as any).trainerType === TrainerType.TOOL || (c as any).trainerType === TrainerType.STADIUM;
        }
        if (c.superType === SuperType.ENERGY) {
          return (c as any).energyType === EnergyType.SPECIAL;
        }
        return false;
      });

      // If there are no eligible cards, just discard Sidney and do nothing else
      if (candidates.cards.length === 0) {
        player.supporter.moveCardTo(this, player.discard);
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        candidates,
        {},
        { allowCancel: false, min: 0, max: 2 }
      ), cards => {
        player.supporter.moveCardTo(this, player.discard);
        if (cards === null || cards.length === 0) {
          return;
        }
        cards.forEach(card => {
          opponent.hand.moveCardTo(card, opponent.discard);
        });

        return state;
      });
    
    }
     return state;
  }};
