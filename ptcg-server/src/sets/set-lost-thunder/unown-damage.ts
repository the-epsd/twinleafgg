import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, PlayerType } from '../../game';
import { GameWinner } from '../../game';
import { endGame } from '../../game/store/effect-reducers/check-effect';
import { Effect } from '../../game/store/effects/effect';

import { WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class UnownDAMAGE extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 60;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'DAMAGE',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, and if there are 66 or more damage counters on your Benched Pokémon, you may use this Ability. If you do, you win this game.'
  }];

  public attacks = [
    { name: 'Hidden Power', cost: [CardType.PSYCHIC], damage: 10, text: '' }
  ];

  public set: string = 'LOT';
  public setNumber = '90';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Unown';
  public fullName: string = 'Unown DAMAGE LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // DAMAGE
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const owner = state.activePlayer;

      let totalDamage = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList === player.active) {
          return;
        }
        totalDamage += cardList.damage;
      });

      if (player.active.getPokemonCard() !== this || totalDamage < 660) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (totalDamage >= 660) {
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
