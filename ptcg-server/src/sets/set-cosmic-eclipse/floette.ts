import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, ShuffleDeckPrompt, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Floette extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = Y;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }]
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

      if (opponent.hand.cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const randomCard = opponent.hand.cards[randomIndex];
        opponent.hand.moveCardTo(randomCard, opponent.deck);
        store.prompt(state, [
          new ShuffleDeckPrompt(opponent.id)
        ], deckOrder => {
          opponent.deck.applyOrder(deckOrder);
        });
      }
    }

    return state;
  }
}