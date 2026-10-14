import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardTag, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, Player, PokemonCardList, PlayerType, SlotType, ChooseCardsPrompt } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const hasBench = player.bench.some((b) => b.cards.length > 0);

  if (hasBench === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [effect.trainerCard], sourceCard: effect.trainerCard });
  effect.preventDefault = true;

  let targets: PokemonCardList[] = [];
  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH],
      { allowCancel: true },
    ),
    (results) => {
      targets = results || [];
      next();
    },
  );

  if (targets.length === 0) {
    return state;
  }

  const target = targets[0];
  const hasEnergies = player.active.cards.some((c) => c.superType === SuperType.ENERGY);

  if (hasEnergies) {
    yield store.prompt(
      state,
      new ChooseCardsPrompt(
        player,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0 },
      ),
      (selected) => {
        selected = selected || [];
        MOVE_CARDS(store, state, player.active, target, { cards: selected, sourceCard: effect.trainerCard });
        next();
      },
    );
  }

  player.switchPokemon(targets[0]);
  return state;
}

export class ScrambleSwitch extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  protected _tags = [CardTag.ACE_SPEC];
  public set: string = 'PLS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '129';
  public name: string = 'Scramble Switch';
  public fullName: string = 'Scramble Switch PLS';
  public text: string =
    'Switch your Active Pokemon with 1 of your Benched Pokemon. ' +
    'Then, you may move as many Energy attached to the old Active Pokemon ' +
    'to the new Active Pokemon as you like.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.bench.some((b) => b.cards.length > 0);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
