import {
  CardTarget,
  ChoosePokemonPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  PokemonCardList,
  SlotType,
  State,
  StoreLike,
  TrainerCard,
  TrainerType,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const blocked: CardTarget[] = [];
  let hasPokemonWithDamage = false;

  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList.damage === 0) {
      blocked.push(target);
    } else {
      hasPokemonWithDamage = true;
    }
  });

  if (!hasPokemonWithDamage) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;

  let targets: PokemonCardList[] = [];
  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_HEAL,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { allowCancel: false, blocked },
    ),
    (results) => {
      targets = results || [];
      next();
    },
  );

  if (targets.length === 0) {
    return state;
  }

  targets.forEach((target) => {
    const healEffect = new HealEffect(player, target, 30);
    store.reduceEffect(state, healEffect);
  });

  return state;
}

export class Potion extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '132';
  public name: string = 'Potion';
  public fullName: string = 'Potion BCR';
  public text: string = 'Heal 30 damage from 1 of your Pokemon.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    let hasPokemonWithDamage = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      if (cardList.damage !== 0) {
        hasPokemonWithDamage = true;
      }
    });
    return hasPokemonWithDamage;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
