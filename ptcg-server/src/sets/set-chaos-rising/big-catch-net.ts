import { Card } from '../../game/store/card/card';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { EnergyCard } from '../../game/store/card/energy-card';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { CardType } from '../../game/store/card/card-types';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    const isWaterPokemon = c instanceof PokemonCard && c.cardType === CardType.WATER;
    const isBasicWaterEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.WATER);
    if (!isWaterPokemon && !isBasicWaterEnergy) {
      blocked.push(index);
    }
  });
  const eligibleCount = player.discard.cards.length - blocked.length;
  if (eligibleCount === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  effect.preventDefault = true;
  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DECK,
    player.discard,
    {},
    { min: 0, max: 6, allowCancel: false, blocked, maxPokemons: 3, maxBasicEnergies: 3 }
  ), selected => {
    cards = selected || [];
    next();
  });
  if (cards.length > 0) {
    cards.forEach(card => {
      store.log(state, GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
    });
    player.discard.moveCardsTo(cards, player.deck);
  }
  const cardList = StateUtils.findCardList(state, effect.trainerCard);
  if (cardList) cardList.moveCardTo(effect.trainerCard, player.discard);
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class BigCatchNet extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'M4';
  public regulationMark = 'J';
  public name: string = 'Big Catch Net';
  public fullName: string = 'Big Catch Net M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public text: string = 'Shuffle up to 3 [W] Pokemon and up to 3 Basic [W] Energy from your discard pile into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
