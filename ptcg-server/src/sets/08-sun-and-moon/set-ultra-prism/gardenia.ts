import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
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
  StoreLike,
  TrainerCard,
} from '../../../game';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Gardenia,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;

  if (!self.canPlay(store, state, player)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (!self.canHeal(cardList)) {
      blocked.push(target);
    }
  });

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

  const healEffect = new HealEffect(player, targets[0], 80);
  store.reduceEffect(state, healEffect);
  return state;
}

export class Gardenia extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '124';
  public name: string = 'Gardenia';
  public fullName: string = 'Gardenia UPR';
  public text: string =
    'Heal 80 damage from 1 of your Pokémon that has any [G] Energy attached to it.';

  public canHeal(cardList: PokemonCardList): boolean {
    return (
      cardList.damage > 0 &&
      cardList.energies.cards.some(
        (c) => c.superType === SuperType.ENERGY && c.name === 'Grass Energy',
      )
    );
  }

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    let hasPokemonToHeal = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      if (this.canHeal(cardList)) {
        hasPokemonToHeal = true;
      }
    });
    if (!hasPokemonToHeal) {
      return false;
    }

    // Need at least 4 other cards in hand and a non-empty deck
    if (player.hand.cards.filter((c) => c !== this).length < 4) {
      return false;
    }
    return player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
