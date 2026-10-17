import {
  Card,
  CardList,
  CardTarget,
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  PokemonCardList,
  SlotType,
  StateUtils,
} from '../../../game';
import { Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { SupporterEffect, TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

// Opponent's Pokémon without an Energy attached can't be chosen
function getEnergyTargets(
  state: State,
  player: Player,
): { hasPokemonWithEnergy: boolean; blocked: CardTarget[] } {
  const opponent = StateUtils.getOpponent(state, player);
  let hasPokemonWithEnergy = false;
  const blocked: CardTarget[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (cardList.cards.some((c) => c.superType === SuperType.ENERGY)) {
      hasPokemonWithEnergy = true;
    } else {
      blocked.push(target);
    }
  });
  return { hasPokemonWithEnergy, blocked };
}

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Plumeria,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  let cardsInHand: Card[] = [];

  cardsInHand = player.hand.cards.filter((c) => c !== effect.trainerCard);
  if (cardsInHand.length < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const { hasPokemonWithEnergy, blocked } = getEnergyTargets(state, player);

  if (!hasPokemonWithEnergy) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;
  MOVE_CARDS(store, state, player.hand, player.supporter, {
    cards: [effect.trainerCard],
    sourceCard: self,
  });

  const handTemp = new CardList();
  handTemp.cards = player.hand.cards.filter((c) => c !== self);

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      handTemp,
      {},
      { min: 2, max: 2, allowCancel: false },
    ),
    (selected) => {
      cardsInHand = selected || [];
      next();
    },
  );

  // Operation canceled by the user
  if (cardsInHand.length === 0) {
    return state;
  }

  MOVE_CARDS(store, state, player.hand, player.discard, { cards: cardsInHand, sourceCard: self });

  let targets: PokemonCardList[] = [];
  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      PlayerType.TOP_PLAYER,
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

  const cardList = targets[0];

  if (cardList.isStage(Stage.BASIC)) {
    try {
      const supporterEffect = new SupporterEffect(player, effect.trainerCard);
      store.reduceEffect(state, supporterEffect);
    } catch {
      return state;
    }
  }

  const target = targets[0];
  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DISCARD,
      target,
      { superType: SuperType.ENERGY },
      { min: 1, max: 1, allowCancel: false },
    ),
    (selected) => {
      cards = selected;
      next();
    },
  );
  MOVE_CARDS(store, state, target, opponent.discard, { cards, sourceCard: self });
  return state;
}

export class Plumeria extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '120';
  public name: string = 'Plumeria';
  public fullName: string = 'Plumeria BUS';
  public text: string =
    "Discard 2 cards from your hand. If you do, discard an Energy from 1 of your opponent's Pokémon.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Need 2 other cards in hand to discard
    if (player.hand.cards.filter((c) => c !== this).length < 2) {
      return false;
    }
    // Opponent needs a Pokémon with an Energy attached
    return getEnergyTargets(state, player).hasPokemonWithEnergy;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}
