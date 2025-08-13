import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Bayleef extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public weakness = [{ type: CardType.FIRE }];
  public evolvesFrom: string = 'Chikorita';

  public attacks = [{
    name: 'Body Slam',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokemon is now Paralyzed'
  },
  {
    name: 'Vine Whip',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set: string = 'BKP';
  public name: string = 'Bayleef';
  public fullName: string = 'Bayleef BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    return state;
  }
}