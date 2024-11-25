import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Card, CardList, ChooseCardsPrompt, CoinFlipPrompt, GameError, GameMessage, PowerType, ShowCardsPrompt, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Munchlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 60;

  public powers = [{
    name: 'Snack Search',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: ' Once during your turn (before your attack), you may flip a coin.'
      + 'If heads, put a card from your discard pile on top of your deck. If you use this Ability, your turn ends. '
  }];

  public set = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '173';
  public name = 'Munchlax';
  public fullName = 'Munchlax UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let cards: Card[] = [];

      if (player.discard.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Checking to see if ability is being blocked
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {

        if (result) {
          const deckTop = new CardList();

          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK,
            player.discard,
            {},
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            cards = selected || [];

            player.discard.moveCardsTo(cards, deckTop);
            deckTop.moveToTopOfDestination(player.deck);

            if (cards.length > 0) {
              return store.prompt(state, new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                cards
              ), () => {
                return state;
              });
            }

            player.deck.moveCardsTo(cards, deckTop);
          });
        }
      });

      const endTurnEffect = new EndTurnEffect(player);
      store.reduceEffect(state, endTurnEffect);
      return state;

    }

    return state;
  }
}