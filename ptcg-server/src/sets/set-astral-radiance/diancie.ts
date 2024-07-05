import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SupporterEffect } from '../../game/store/effects/play-card-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Diancie extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public powers = [{
    name: 'Princess\'s Curtain',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to your Benched Basic Pokémon.'
  }];

  public attacks = [{
    name: 'Spike Draw',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: 'Draw 2 cards.'
  }];

  public set: string = 'ASR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '68';

  public name: string = 'Diancie';

  public fullName: string = 'Diancie ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof SupporterEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isDiancieInPlay = false;

      if (player.active.cards[0] == this) {
        isDiancieInPlay = true;
      }

      if (opponent.active.cards[0] == this) {
        isDiancieInPlay = true;
      }

      if (!isDiancieInPlay) {
        return state;
      }

      // Try reducing ability for opponent
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
      effect.preventDefault = true;
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    return state;
  }
}