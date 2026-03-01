import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Octillery extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Remoraid';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Sharpshooting',
      cost: [W],
      damage: 0,
      text: 'This attack does 30 damage to 1 of your opponent\'s Pok\u00e9mon. (Don\'t apply Weakness and Resistance for Benched Pok\u00e9mon.)'
    },
    {
      name: 'Bubble Beam',
      cost: [W, W],
      damage: 40,
      text: 'Flip a coin. If heads, the Defending Pok\u00e9mon is now Paralyzed.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Octillery';
  public fullName: string = 'Octillery PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state);
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}
