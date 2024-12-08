import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, StateUtils } from '../../game';
import { AttackEffect, Effect, PowerEffect } from '../../game/store/effects/game-effects';

export class TestPokemon extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 100;

  public weakness = [{ type: CardType.COLORLESS }];

  public retreat = [];

  public powers = [{
    name: 'Extremely Cursed Blast',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, both players Active Pokemon are Knocked Out.'
  }];

  public attacks = [
    {
      name: 'Put Opponent Card In Prizes',
      cost: [],
      damage: 0,
      text: 'Add top 2 cards of opponent\'s deck to prizes',
      effect: (store: StoreLike, state: State, effect: AttackEffect) => {
      }
    }
  ];

  public set: string = 'TEST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '1';

  public name: string = 'Test';

  public fullName: string = 'Test TEST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    //   if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
    //     const player = effect.player;
    //     const opponent = StateUtils.getOpponent(state, player);

    //     const deckTop = new CardList();
    //     opponent.deck.moveTo(deckTop, 2);

    //     deckTop.moveTo(opponent.prizes);

    //     import { Pokemon } from '../models/pokemon';

    //     const newPrizeCard1 = new Pokemon();

    //     import { Card, PokemonCard } from '../models';

    //     const newPrizeCard2 = new PokemonCard();

    //     opponent.prizes.push(newPrizeCard1, newPrizeCard2);
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentActive = opponent.active.getPokemonCard();
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.damage += 999;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        if (cardList.getPokemonCard() === opponentActive) {
          cardList.damage += 999;
        }
      });
    }
    return state;
  }
}