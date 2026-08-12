import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, SuperType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, Card, ChooseCardsPrompt, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

function* useRegiGate(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect,
  self: Card,
): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter((b) => b.cards.length === 0);
  const max = Math.min(slots.length, 1);

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      player.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
      { min: 0, max, allowCancel: false },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    MOVE_CARDS(store, state, player.deck, slots[index], {
      cards: [card],
      sourceCard: self,
      sourceEffect: self.attacks[0],
    });
    slots[index].pokemonPlayedTurn = state.turn;
  });

  SHUFFLE_DECK(store, state, player);
}

export class Regice extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = W;
  public hp = 130;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Regi Gate',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
  },
  {
    name: 'Blizzard Bind',
    cost: [W, W, C],
    damage: 100,
    text: 'If the Defending Pokémon is a Pokémon V, it can\'t attack during your opponent\'s next turn.'
  }];

  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Regice';
  public fullName: string = 'Regice ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Regi Gate
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useRegiGate(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }
    // Blizzard Bind
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const defendingPokemon = effect.player.active.getPokemonCard();
      if (defendingPokemon?.tags.includes(CardTag.POKEMON_V)) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    return state;
  }
}
