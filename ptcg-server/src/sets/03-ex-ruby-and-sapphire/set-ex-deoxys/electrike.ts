import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED, OPPONENT_CANNOT_PLAY_TRAINER_CARDS } from '../../../game/store/prefabs/prefabs';

export class Electrike extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'High Voltage',
    cost: [L],
    damage: 0,
    text: 'Flip a coin. If heads, your opponent can\'t play Trainer cards from his or her hand during his or her next turn.',
  }, {
    name: 'Gnaw',
    cost: [C, C],
    damage: 20,
    text: '',
  }];

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Electrike';
  public fullName: string = 'Electrike DX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // High Voltage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          OPPONENT_CANNOT_PLAY_TRAINER_CARDS(store, state, effect, this);
        }
      });
    }
    return state;
  }
}
