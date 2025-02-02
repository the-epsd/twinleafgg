import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, BoardEffect } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, CoinFlipPrompt, EnergyCard, GameError, GameMessage, PlayerType, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Revavroom extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.METAL;
  public hp: number = 140;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom: string = 'Varoom';

  public powers = [{
    name: 'Rumbling Engine',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'You must discard an Energy card from your hand in order to use this Ability. Once during your turn, you may draw cards until you have 6 cards in your hand.'
  }];

  public attacks = [{
    name: 'Knock Away',
    cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 90 more damage.'
  }];

  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '142';
  public name: string = 'Revavroom';
  public fullName: string = 'Revavroom SVI';

  public readonly RUMBLING_ENGINE_MARKER = 'RUMBLING_ENGINE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.RUMBLING_ENGINE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.RUMBLING_ENGINE_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.hand.cards.length >= 7) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard;
      });

      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.RUMBLING_ENGINE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: true, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        player.hand.moveCardsTo(cards, player.discard);

        while (player.hand.cards.length < 6) {
          if (player.deck.cards.length === 0) {
            break;
          }
          player.deck.moveTo(player.hand, 1);
        }

        player.marker.addMarker(this.RUMBLING_ENGINE_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 90;
        }
      });
    }

    return state;
  }
}