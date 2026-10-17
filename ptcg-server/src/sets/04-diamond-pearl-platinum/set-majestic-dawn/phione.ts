import { Card, ChooseCardsPrompt, GameMessage, PokemonCard, ShuffleDeckPrompt, State, StoreLike } from '../../../game';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';
import { AttackEffect } from '../../../game/store/effects/game-effects';

function* useAscension(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_EVOLVE,
    player.deck,
    { superType: SuperType.POKEMON, evolvesFrom: 'any' },
    { min: 0, max: 1, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    // Evolve Pokemon
    MOVE_CARDS(store, state, player.deck, player.active, { cards: cards, sourceCard: effect.source.getPokemonCard()! });
    player.active.clearEffects();
    player.active.pokemonPlayedTurn = state.turn;
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Phione extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Evolution Wish',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a card that evolves from 1 of your Pokémon and put it onto that Pokémon. (This counts as evolving that Pokémon.) Shuffle your deck afterward.'
  },
  {
    name: 'Water Pulse',
    cost: [W, W],
    damage: 30,
    text: 'The Defending Pokémon is now Asleep.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Phione';
  public fullName: string = 'Phione MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Evolution Wish
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useAscension(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    // Water Pulse
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}
