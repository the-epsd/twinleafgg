import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Lombre extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Lotad';
  public hp: number = 70;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: 20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Torment',
    cost: [C, C],
    damage: 20,
    text: 'Flip a coin. If heads, your opponent can\'t play any Supporter cards from his or her hand during his or her next turn.'
  },
{
    name: 'Absorb',
    cost: [W, W],
    damage: 40,
    text: 'Remove 2 damage counters from Lombre.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Lombre';
  public fullName: string = 'Lombre SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Torment
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS(store, state, effect, this);
        }
      });
    }

    // Absorb
    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    return state;
  }
}
