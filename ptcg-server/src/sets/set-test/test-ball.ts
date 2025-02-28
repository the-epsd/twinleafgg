import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { Card, PokemonCardList } from '../../game';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { Charizardex } from '../set-obsidian-flames/charizard-ex';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

  // Check if bench has open slots
  if (slots.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Get Charizard ex from player's deck
  const charizard: Card = new Charizardex();
  if (!charizard) {
    throw new GameError(GameMessage.UNKNOWN_CARD);
  }
  const targetSlot = slots[0];

  // Place onto bench
  targetSlot.cards.push(charizard);
  targetSlot.pokemonPlayedTurn = state.turn;

  store.log(state, GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, {
    name: player.name,
    card: charizard.name
  });

  // Move trainer to discard
  player.hand.moveCardTo(effect.trainerCard, player.discard);

  return state;
}


export class TestBall extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'TEST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '2';

  public name: string = 'Test Ball';

  public fullName: string = 'Test Ball TEST';

  public text: string =
    'Search your deck for a Basic Pokémon and put it onto your ' +
    'Bench. Then, shuffle your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
