import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { endGame } from '../../game/store/effect-reducers/check-effect';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { GameWinner, State, StoreLike } from '../../game';
export class UnownV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];
  public regulationMark = 'F';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 180;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Shady Stamp',
      cost: [P],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    },
    {
      name: 'Victory Symbol',
      cost: [C, C, C],
      damage: 0,
      text: 'If you use this attack when you have only 1 Prize card remaining, you win this game.'
    },
  ];

  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Unown V';
  public fullName: string = 'Unown V SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    // Star Cipher
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const owner = state.activePlayer;

      if (player.getPrizeLeft() === 1) {
        if (owner === 0) {
          state = endGame(store, state, GameWinner.PLAYER_1);
        }
        if (owner === 1) {
          state = endGame(store, state, GameWinner.PLAYER_2);
        }
      }
    }

    return state;
  }
}  