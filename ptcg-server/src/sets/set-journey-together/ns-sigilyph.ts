import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameWinner } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { endGame } from '../../game/store/effect-reducers/check-effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class NsSigilyph extends PokemonCard {

  public tags = [CardTag.NS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Psychic Sphere',
      cost: [P],
      damage: 20,
      text: ''
    },
    {
      name: 'Victory Symbol',
      cost: [P, C, C],
      damage: 0,
      text: 'If you use this attack when you have exactly 1 Prize card remaining, you win this game. '
    }
  ];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'N\'s Sigilyph';
  public fullName: string = 'N\'s Sigilyph (JTG 64)';
  public legacyFullName = 'N\'s Sigilyph JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const owner = state.activePlayer;

      if (player.getPrizeLeft() === 6) {
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