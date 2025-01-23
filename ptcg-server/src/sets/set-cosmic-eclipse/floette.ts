import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, GameMessage, PowerType, ShowCardsPrompt, ShuffleDeckPrompt, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Floette extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = Y;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];
  public evolvesFrom = 'Flabébé';

  public powers = [{
    name: 'Flower Picking',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may choose a random card from your opponent\'s hand.Your opponent reveals that card and shuffles it into their deck.'
  }];

  public attacks = [{
    name: 'Magical Shot',
    cost: [Y, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'CEC';
  public name: string = 'Floette';
  public fullName: string = 'Floette CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '151';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Opponent has no cards in the hand
      if (opponent.hand.cards.length === 0) {
        return state;
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        opponent.hand,
        {},
        { min: 1, max: 1, allowCancel: false, isSecret: true }
      ), selected => {
        cards = selected || [];

        if (cards.length > 0) {
          state = store.prompt(state, new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            cards), () => state
          );
        }

        opponent.hand.moveCardsTo(cards, opponent.deck);

        return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
          opponent.deck.applyOrder(order);
        });
      });

    }

    return state;
  }
}