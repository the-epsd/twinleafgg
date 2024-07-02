import { Card } from '../../game/store/card/card';
import { GameLog, GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard, GameError } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State,
  self: RoseannesBackup, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  // Count tools and items separately
  let pokemon = 0;
  let tools = 0;
  let stadiums = 0;
  let energies = 0;
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (c instanceof PokemonCard && c.cardType === CardType.ANY) {
      pokemon += 1;
    } else if (c instanceof TrainerCard && c.trainerType === TrainerType.TOOL) {
      tools += 1;
    } else if (c instanceof TrainerCard && c.trainerType === TrainerType.STADIUM) {
      stadiums += 1;
    } else if (c instanceof EnergyCard && c.provides.includes(CardType.ANY)) {
      energies += 1;
    } else {
      blocked.push(index);
    }
  });

  // Limit max for each type to 1
  const maxPokemons = Math.min(pokemon, 1);
  const maxTools = Math.min(tools, 1);
  const maxStadiums = Math.min(stadiums, 1);
  const maxEnergies = Math.min(energies, 1);

  // Total max is sum of max for each 
  const count = maxPokemons + maxTools + maxStadiums + maxEnergies;

  // Pass max counts to prompt options
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_ONE_ITEM_AND_ONE_TOOL_TO_HAND,
    player.discard,
    {},
    { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxTools, maxStadiums, maxEnergies }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.discard.moveCardsTo(cards, player.deck);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  

  cards.forEach((card, index) => {
    store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
  });

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class RoseannesBackup extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BRS';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '148';

  public name: string = 'Roseanne\'s Backup';

  public fullName: string = 'Roseanne\'s Backup BRS';

  public text: string =
    'Choose 1 or more:' +
    '' +
    '• Shuffle a Pokémon from your discard pile into your deck.' +
    '• Shuffle a Pokémon Tool card from your discard pile into your deck.' +
    '• Shuffle a Stadium card from your discard pile into your deck.' +
    '• Shuffle an Energy card from your discard pile into your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
