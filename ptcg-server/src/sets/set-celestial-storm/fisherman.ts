import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';


function* playCard(next: Function, store: StoreLike, state: State,
  self: Fisherman, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }
  
  let basicEnergies = 0;
  player.discard.cards.forEach(c => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
      basicEnergies += 1;
    }
  });

  if (basicEnergies === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  
  const min = Math.max(4, basicEnergies);
  const max = Math.max(4, basicEnergies);

  player.hand.moveCardTo(effect.trainerCard, player.supporter);  
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let recovered: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { min, max, allowCancel: false }
  ), selected => {
    recovered = selected || [];
    next();
  });

  // Operation canceled by the user
  if (recovered.length === 0) {
    return state;
  }

  player.discard.moveCardsTo(recovered, player.hand);

  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  return state;
}

export class Fisherman extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CES';

  public name: string = 'Fisherman';

  public fullName: string = 'Fisherman CES';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '130';

  public text: string = 'Put 4 basic Energy cards from your discard pile into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
