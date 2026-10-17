import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
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
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: ToolScrapper,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let pokemonsWithTool = 0;
  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (cardList.tools.length > 0) {
      pokemonsWithTool += 1;
    } else {
      blocked.push(target);
    }
  });
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (cardList.tools.length > 0) {
      pokemonsWithTool += 1;
    } else {
      blocked.push(target);
    }
  });

  if (pokemonsWithTool === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;

  const max = Math.min(2, pokemonsWithTool);
  let targets: PokemonCardList[] = [];
  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      PlayerType.ANY,
      [SlotType.ACTIVE, SlotType.BENCH],
      { min: 1, max, allowCancel: true, blocked },
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
    const owner = StateUtils.findOwner(state, target);
    if (target.tools.length > 0) {
      MOVE_CARDS(store, state, target, owner.discard, {
        cards: [target.tools[0]],
        sourceCard: self,
      });
    }
  });

  return state;
}

export class ToolScrapper extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'DRX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '116';
  public name: string = 'Tool Scrapper';
  public fullName: string = 'Tool Scrapper DRX';
  public text: string =
    'Choose up to 2 Pokemon Tool cards attached to Pokemon in play (yours or ' +
    "your opponent's) and discard them.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    let pokemonsWithTool = 0;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      if (cardList.tools.length > 0) {
        pokemonsWithTool += 1;
      }
    });
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
      if (cardList.tools.length > 0) {
        pokemonsWithTool += 1;
      }
    });
    return pokemonsWithTool > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
