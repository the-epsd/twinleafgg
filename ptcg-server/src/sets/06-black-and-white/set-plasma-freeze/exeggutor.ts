import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS } from '../../../game/store/prefabs/prefabs';

export class Exeggutor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Exeggcute';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Blockade',
    cost: [C],
    damage: 10,
    text: 'Your opponent can\'t play any Supporter cards from his or her hand during his or her next turn.'
  }, {
    name: 'Stomp',
    cost: [G, C, C],
    damage: 60,
    text: 'Flip a coin. If heads, this attack does 30 more damage. '
  }];

  public set: string = 'PLF';
  public setNumber: string = '5';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Exeggutor';
  public fullName: string = 'Exeggutor PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Blockade
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS(store, state, effect, this);
    }

    // Stomp
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result === true) {
          effect.damage += 30;
        }
      });
    }

    return state;
  }
}
