import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

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
    { superType: SuperType.POKEMON, evolvesFrom: 'Exeggcute' },
    { min: 0, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    // Evolve Pokemon
    player.deck.moveCardsTo(cards, player.active);
    player.active.clearEffects();
    player.active.pokemonPlayedTurn = state.turn;
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Exeggcute extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 30;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Precocious Evolution',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'If you go first, you can use this attack on your first turn. Search your deck for a card that evolves from this Pokémon and put it onto this Pokémon to evolve it. Then, shuffle your deck.'
  }
  ];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '1';

  public name: string = 'Exeggcute';

  public fullName: string = 'Exeggcute SV7a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const player = state.players[state.activePlayer];

    if (state.turn == 1 && player.active.cards[0] == this) {
      player.canAttackFirstTurn = true;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useAscension(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
