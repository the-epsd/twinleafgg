import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage, CardManager, PokemonCard, PlayerType, CardTarget, PokemonCardList, ChoosePokemonPrompt, SlotType, Card, ChooseCardsPrompt, StateUtils, ShuffleDeckPrompt } from '../../game';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPlayedTurnEffect } from '../../game/store/effects/check-effects';

function* useStadium(next: Function, store: StoreLike, state: State, effect: UseStadiumEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // Look through all known cards to find out if Pokemon can evolve
  const cm = CardManager.getInstance();
  const evolutions = cm.getAllCards().filter(c => {
    return c instanceof PokemonCard && c.stage !== Stage.BASIC;
  }) as PokemonCard[];

  // Build possible evolution card names
  const evolutionNames: string[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    const playedTurnEffect = new CheckPokemonPlayedTurnEffect(player, list);
    store.reduceEffect(state, playedTurnEffect);
    if (card.stage !== Stage.BASIC || playedTurnEffect.pokemonPlayedTurn === state.turn) {
      return;
    }
    const valid = evolutions.filter(e => e.evolvesFrom === card.name);
    valid.forEach(c => {
      if (!evolutionNames.includes(c.name)) {
        evolutionNames.push(c.name);
      }
    });
  });


  // There is nothing that can evolve
  if (evolutionNames.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const blocked2: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    if (card.stage !== Stage.BASIC) {
      blocked2.push(target);
    }
  });

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE],
    { min: 1, max: 1, allowCancel: false, blocked: blocked2 }
  ), selection => {
    targets = selection || [];
    next();
  });

  if (targets.length === 0) {
    return state; // canceled by user
  }

  const target = targets[0];
  const pokemonCard = target.getPokemonCard();
  if (pokemonCard === undefined) {
    return state; // invalid target?
  }

  // Blocking pokemon cards, that cannot be valid evolutions
  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (card instanceof PokemonCard && card.evolvesFrom !== pokemonCard.name) {
      blocked.push(index);
    }
  });

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_EVOLVE,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.STAGE_1, evolvesFrom: pokemonCard.name },
    { min: 1, max: 1, allowCancel: true, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Canceled by user, he didn't find the card in the deck
  if (cards.length === 0) {
    return state;
  }

  const evolution = cards[0] as PokemonCard;

  // Evolve Pokemon
  player.deck.moveCardTo(evolution, target);
  target.clearEffects();
  target.pokemonPlayedTurn = state.turn;

  // Check if there's a Stage 2 evolution available
  const stage2Evolutions = evolutions.filter(e => e.evolvesFrom === evolution.name);
  if (stage2Evolutions.length > 0) {
    // Blocking pokemon cards, that cannot be valid evolutions
    const blockedStage2: number[] = [];
    player.deck.cards.forEach((card, index) => {
      if (card instanceof PokemonCard && card.evolvesFrom !== evolution.name) {
        blockedStage2.push(index);
      }
    });

    let stage2Cards: Card[] = [];
    yield store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_EVOLVE,
      player.deck,
      { superType: SuperType.POKEMON, stage: Stage.STAGE_2, evolvesFrom: evolution.name },
      { min: 1, max: 1, allowCancel: true, blocked: blockedStage2 }
    ), selected => {
      stage2Cards = selected || [];
      next();
    });

    if (stage2Cards.length > 0) {
      const stage2Evolution = stage2Cards[0] as PokemonCard;
      player.deck.moveCardTo(stage2Evolution, target);
      target.clearEffects();
      target.pokemonPlayedTurn = state.turn;
    }
  }
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}


export class GreatTree extends TrainerCard {

  public trainerType = TrainerType.STADIUM;

  public tags = [CardTag.ACE_SPEC];

  public set = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '136';

  public regulationMark = 'H';

  public name = 'Grand Tree';

  public fullName = 'Great Tree SV7';

  public text = 'Once during each player\'s turn, that player may search their deck for a Stage 1 Pokémon that evolves from 1 of their Basic Pokémon and put it onto that Pokémon to evolve it.If that Pokémon was evolved in this way, that player may search their deck for a Stage 2 Pokémon that evolves from that Pokémon and put it onto that Pokémon to evolve it.Then, that player shuffles their deck. (Players can\'t evolve a Basic Pokémon during their first turn or a Basic Pokémon that was put into play this turn.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const generator = useStadium(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
