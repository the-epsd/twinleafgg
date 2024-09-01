import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  // Create list of non - Pokemon SP slots
  const blocked: CardTarget[] = [];
  let hasColorlessPokemon = false;

  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    const isColorlessPokemon = card.cardType === CardType.COLORLESS;
    hasColorlessPokemon = hasColorlessPokemon || isColorlessPokemon;
    if (!isColorlessPokemon) {
      blocked.push(target);
    }
  });

  if (!hasColorlessPokemon) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { min: 1, max: 1, allowCancel: true, blocked }
  ), targets => {
    if (targets && targets.length > 0) {
      targets[0].clearEffects();
      targets[0].damage = 0;
      targets[0].moveTo(player.hand);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);

    }
  });
}

export class CherensCare extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'F';

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '134';

  public name: string = 'Cheren\'s Care';

  public fullName: string = 'Cheren\'s Care BRS';

  public text: string =
    'Put 1 of your [C] Pokémon that has any damage counters on it and all attached cards into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
