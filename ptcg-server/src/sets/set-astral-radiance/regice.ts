import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, Card, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt, GameError, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

function* useRegiGate(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 1);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC },
    { min: 0, max, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}
export class Regice extends PokemonCard {

  public cardType = CardType.WATER;

  public stage = Stage.BASIC;

  public hp = 130;

  public weakness = [{ type: CardType.METAL }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Regi Gate',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
    },
    {
      name: 'Blizzard Bind',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 100,
      text: 'If the Defending Pokémon is a Pokémon V, it can\'t attack during your opponent\'s next turn.'
    }
  ];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '37';

  public name: string = 'Regice';

  public fullName: string = 'Regice ASR';

  public readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useRegiGate(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
    }

    if (effect instanceof UseAttackEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();
      if (pokemonCard && pokemonCard.tags.includes(CardTag.POKEMON_V) || pokemonCard && pokemonCard.tags.includes(CardTag.POKEMON_VSTAR) || pokemonCard && pokemonCard.tags.includes(CardTag.POKEMON_VMAX)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
    }

    return state;
  }
}