import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Vileplume extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Gloom';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Irritating Pollen',
    powerType: PowerType.ABILITY,
    text: 'Each player can\'t play any Item cards from his or her hand.'
  }];

  public attacks = [{
    name: 'Solar Beam',
    cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
    damage: 70,
    text: ''
  }];

  public set: string = 'AOR';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vileplume';
  public fullName: string = 'Vileplume AOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let vileplumeInPlay = false;

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

      // Checks for Vileplume in play on Player's Turn
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER && PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          vileplumeInPlay = true;
        }

        if (!vileplumeInPlay) {
          return state;
        }

        if (vileplumeInPlay) {
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        }
      });

      // Checks for Vileplume in play on Opponent's Turn (opponent of the owner of this card)
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER && PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          vileplumeInPlay = true;
        }

        if (!vileplumeInPlay) {
          return state;
        }

        if (vileplumeInPlay) {
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        }
      });

    }

    return state;
  }

}