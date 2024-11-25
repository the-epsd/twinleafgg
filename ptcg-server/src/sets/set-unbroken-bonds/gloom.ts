import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, CoinFlipPrompt, GameError, GameMessage, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Gloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Oddish';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 80;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Irresistible Aroma',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: ' Once during your turn (before your attack), if your opponent\'s Bench isn\'t full, you may flip a coin.'
      + 'If heads, your opponent reveals their hand.Put a Basic Pokémon you find there onto their Bench. '
  }];

  public attacks = [{
    name: 'Drool',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set: string = 'UNB';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gloom';
  public fullName: string = 'Gloom UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const slots: PokemonCardList[] = opponent.bench.filter(b => b.cards.length === 0);

      if (slots.length === 0) {
        // No open slots, throw error
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let cards: Card[] = [];
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result) {
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
            opponent.hand,
            { superType: SuperType.POKEMON, stage: Stage.BASIC },
            { min: 0, max: 1, allowCancel: true }
          ), selected => {
            cards = selected || [];
            if (cards.length === 0) {
              return state;
            }

            cards.forEach((card, index) => {
              opponent.hand.moveCardTo(card, slots[index]);
              slots[index].pokemonPlayedTurn = state.turn;
            });
          });
        }
      });
    }

    return state;
  }
}