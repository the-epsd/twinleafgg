import {
  Card,
  ChooseCardsPrompt,
  GameError, GameMessage,
  PokemonCardList,
  StateUtils
} from '../../game';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let activeHasEnergy = opponent.active.cards.some(c => c.superType === SuperType.ENERGY);

  if (!activeHasEnergy) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.supporterTurn >= 1) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let target: PokemonCardList = opponent.active as PokemonCardList;

  let cards: Card[] = [];

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    target,
    { superType: SuperType.ENERGY },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected;
    next();
  });

  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  target.moveCardsTo(cards, opponent.discard);

  return state;
}

export class TeamFlareGrunt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'GEN';

  public name: string = 'Team Flare Grunt';

  public fullName: string = 'Team Flare Grunt GEN';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '73';

  public text: string =
    'Discard an Energy attached to your opponent\'s Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
