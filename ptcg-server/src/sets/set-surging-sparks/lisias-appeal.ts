import { TrainerCard } from '../../game/store/card/trainer-card';
import { SpecialCondition, Stage, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { SupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, SlotType, StateUtils, GameError, GameMessage, PokemonCard, CardTarget } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasBench = opponent.bench.some(b => b.cards.length > 0);
  const supporterTurn = player.supporterTurn;

  if (!hasBench) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  const blocked: CardTarget[] = [];
  player.deck.cards.forEach((card, index) => {
    if (card instanceof PokemonCard && card.stage !== Stage.BASIC) {
      blocked.push();
    }
  });

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.TOP_PLAYER,
    [SlotType.BENCH],
    { allowCancel: false, blocked: blocked }
  ), result => {
    const cardList = result[0];

    try {
      const supporterEffect = new SupporterEffect(player, effect.trainerCard);
      store.reduceEffect(state, supporterEffect);
    } catch {
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      return state;
    }

    opponent.switchPokemon(cardList);
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
    return state;
  });
}

export class LisiasAppeal extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '179';

  public name: string = 'Lisia\'s Appeal';

  public fullName: string = 'Lisia\'s Appeal SV8';

  public text: string =
    'Switch in 1 of your opponent\'s Benched Basic Pokémon to the Active Spot. The new Active Pokémon is now Confused.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
