import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardList, ChooseCardsPrompt, PokemonCard, SelectPrompt, ShowCardsPrompt } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, self: Tyme, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let isPokemonInHand = false;
  player.hand.cards.forEach(card => {
    if (card instanceof PokemonCard){ isPokemonInHand = true; }
  });
  if (!isPokemonInHand){ throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD); }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  if (player.supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }
  
  // loading up all of the choices
  const options = [
    { value: 10, message: '10' }
  ];
  for (let i = 2; i <= 50; i++){
    options.push( { value: 10 * i, message: '' + 10 * i } )
  }

  const selectedPokemon = new CardList();
  let pokemonName = '';
  let pokemonHP = 0;

  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.hand,
    { superType: SuperType.POKEMON },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {

    selected.forEach(card => {
      if (card instanceof PokemonCard){
        pokemonName = card.name;
        pokemonHP = card.hp;
        player.hand.moveCardTo(card, selectedPokemon);
      }
    });

    // dang if only i knew how to log something entirely unique
    store.log(state, GameLog.LOG_PLAYER_RETURNS_CARD_TO_HAND, { name: player.name, card: pokemonName });

    return store.prompt(state, new SelectPrompt(
      opponent.id,
      GameMessage.CHOOSE_OPTION,
      options.map(c => c.message),
      { allowCancel: false }
    ), choice => {
      const option = options[choice];

      store.prompt(state, new ShowCardsPrompt(
        opponent.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        selectedPokemon.cards
      ), () => {
        if (option.value === pokemonHP){
          opponent.deck.moveTo(opponent.hand, 4);
          selectedPokemon.moveTo(player.hand);
        } else {
          player.deck.moveTo(player.hand, 4);
          selectedPokemon.moveTo(player.hand);
        }
      });

      player.supporter.moveTo(player.discard);
    });
  });


}

export class Tyme extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '190';
  public regulationMark = 'H';
  public name: string = 'Tyme';
  public fullName: string = 'Tyme SSP';

  public text: string =
    'Tell your opponent the name of a Pokémon in your hand and put that Pokémon face down in front of you. Your opponent guesses that Pokémon\'s HP, and then you reveal it. If your opponent guessed right, they draw 4 cards. If they guessed wrong, you draw 4 cards. Then, return the Pokémon to your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}