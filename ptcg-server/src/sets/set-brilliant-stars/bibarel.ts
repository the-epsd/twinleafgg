import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt, GameError, GameMessage, PlayerType } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Bibarel extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'F';

  public evolvesFrom = 'Bidoof';

  public cardType: CardType = CardType.COLORLESS;

  public cardTypez: CardType = CardType.BIBAREL;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Industrious Incisors',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may draw cards until you have 5 cards in your hand.'
  }];

  public attacks = [{
    name: 'Tail Smash',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 100,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '121';

  public name: string = 'Bibarel';

  public fullName: string = 'Bibarel BRS';

  public readonly INDUSTRIOUS_INCISORS_MARKER = 'INDUSTRIOUS_INCISORS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.INDUSTRIOUS_INCISORS_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.INDUSTRIOUS_INCISORS_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.marker.hasMarker(this.INDUSTRIOUS_INCISORS_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.hand.cards.length >= 5) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      //If deck size is greater than 5, draw till hand has 5 cards via while loop
      if (player.deck.cards.length > 5) {
        while (player.hand.cards.length < 5) {
          player.deck.moveTo(player.hand, 1);
        }
      } else {
        //Deck size is less than 5 so we have to check the hand size and draw as many as we can allow

        //If hand size is less than 5, find how many cards until we have 5 in our hand
        let handToFive = 5 - player.hand.cards.length;

        //If the amount of cards until 5 in hand is greater than the deck size, draw the rest of the deck
        if (handToFive > player.deck.cards.length) {
          player.deck.moveTo(player.hand, player.deck.cards.length);
        } else {

          // Distance to 5 cards in hand is less than cards left in deck so draw that amount.
          player.deck.moveTo(player.hand, handToFive);
        }
      }
      player.marker.addMarker(this.INDUSTRIOUS_INCISORS_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addSpecialCondition(SpecialCondition.ABILITY_USED);
        }
      });

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }
    return state;
  }
}