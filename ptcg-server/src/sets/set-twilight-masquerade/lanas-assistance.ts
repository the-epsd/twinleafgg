import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { DiscardToHandEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, EnergyType, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard, EnergyCard, Card, ChooseCardsPrompt } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State,
  self: LanasAssistance, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  let pokemonsOrEnergyInDiscard: number = 0;
  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    const isPokemon = c instanceof PokemonCard && !c.tags.includes(CardTag.POKEMON_ex || CardTag.POKEMON_V || CardTag.POKEMON_VMAX || CardTag.POKEMON_VSTAR);
    const isBasicEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
    if (isPokemon || isBasicEnergy) {
      pokemonsOrEnergyInDiscard += 1;
    } else {
      blocked.push(index);
    }
  });

  // Player does not have correct cards in discard
  if (pokemonsOrEnergyInDiscard === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DECK,
    player.discard,
    {},
    { min: 1, max: 3, allowCancel: false, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.discard.moveCardsTo(cards, player.hand);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);


}

export class LanasAssistance extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '155';

  public name: string = 'Lana\'s Aid';

  public fullName: string = 'Lana\'s Aid TWM';

  public text: string =
    'Put up to 3 in any combination of Pokémon that don\'t have a Rule Box and Basic Energy cards from your discard pile into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      // Check if DiscardToHandEffect is prevented
      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);

      if (discardEffect.preventDefault) {
        // If prevented, just discard the card and return
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      }

      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}
