import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';

function* useAscension(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_EVOLVE,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.STAGE_1, evolvesFrom: 'Feebas'},
    { min: 1, max: 1, allowCancel: true }
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

export class Feebas extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 30;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Ascension',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Search your deck for a card that evolves from this Pokémon and put it onto this Pokémon to evolve it. Then, shuffle your deck.'
  }, {
    name: 'Splash',
    cost: [ CardType.WATER ],
    damage: 10,
    text: ''
  }];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '39';

  public name: string = 'Feebas';

  public fullName: string = 'Feebas SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useAscension(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
