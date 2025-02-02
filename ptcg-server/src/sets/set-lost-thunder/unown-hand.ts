import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage } from '../../game';
import { GameWinner } from '../../game';
import { endGame } from '../../game/store/effect-reducers/check-effect';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class UnownHAND extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'HAND',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, and if you have 35 or more cards in your hand, you may use this Ability. If you do, you win this game.'
  }];

  public attacks = [
    { name: 'Hidden Power', cost: [CardType.PSYCHIC], damage: 10, text: '' }
  ];

  public set: string = 'LOT';

  public setNumber = '91';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Unown';

  public fullName: string = 'Unown LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // HAND
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const owner = state.activePlayer;

      if (player.active.getPokemonCard() !== this || player.hand.cards.length < 35) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.hand.cards.length >= 35) {
        if (owner === 0) {
          state = endGame(store, state, GameWinner.PLAYER_1);
        }
        if (owner === 1) {
          state = endGame(store, state, GameWinner.PLAYER_2);
        }
      }

      return state;
    }

    return state;
  }

}
