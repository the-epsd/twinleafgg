import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Gyarados extends PokemonCard {

  public set = 'BS';

  public fullName = 'Gyarados BS';

  public name = 'Gyarados';

  public cardType: CardType = CardType.WATER;

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Magikarp';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '6';

  public hp: number = 100;

  public weakness = [{ type: G }];

  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Dragon Rage',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER],
      damage: 50,
      text: ''
    },
    {
      name: 'Bubble Beam',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.WATER],
      damage: 40,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    return state;
  }

}