import {
  Card,
  CardTarget,
  ChooseCardsPrompt,
  GameError, GameMessage,
  PlayerType,
  PokemonCardList,
  SlotType,
  StateUtils
} from '../../game';
import { Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { SupporterEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  let cardsInHand: Card[] = [];

  cardsInHand = player.hand.cards.filter(c => c !== effect.trainerCard);
  if (cardsInHand.length < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let hasPokemonWithEnergy = false;
  const blocked: CardTarget[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    if (cardList.cards.some(c => c.superType === SuperType.ENERGY)) {
      hasPokemonWithEnergy = true;
    } else {
      blocked.push(target);
    }
  });

  if (!hasPokemonWithEnergy) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
    PlayerType.TOP_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { allowCancel: false, blocked }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return state;
  }

  const cardList = targets[0];

  if (cardList.stage == Stage.BASIC) {
    try {
      const supporterEffect = new SupporterEffect(player, effect.trainerCard);
      store.reduceEffect(state, supporterEffect);
    } catch {
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      return state;
    }
  }

  const target = targets[0];
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

export class Plumeria extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BUS';

  public name: string = 'Plumeria';

  public fullName: string = 'Plumeria BUS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '120';

  public text: string = 'Discard 2 cards from your hand. If you do, discard an Energy from 1 of your opponent\'s Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }

}
