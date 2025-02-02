import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';

function* useUltraEvolution(next: Function, store: StoreLike, state: State,
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
    { superType: SuperType.POKEMON, stage: Stage.STAGE_2, evolvesFrom: 'Fraxure'},
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

export class Axew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 60;
  public weakness = [];
  public resistance = [];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Ultra Evolution',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Flip a coin. If heads, search your deck for a Haxorus and put it onto this Axew to evolve it. THen shuffle your deck.'
  }];

  public regulationMark: string = 'F';
  public set: string = 'BRS';
  public name: string = 'Axew';
  public fullName: string = 'Axew BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '110';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State { 
    
    if(effect instanceof AttackEffect && effect.attack === this.attacks[0]) { 
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const generator = useUltraEvolution(() => generator.next(), store, state, effect);
          return generator.next().value;
        } 
      });
    }

    return state;
  }

}