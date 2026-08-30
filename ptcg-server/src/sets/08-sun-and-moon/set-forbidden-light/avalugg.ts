import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Avalugg extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bergmite';
  public cardType: CardType[] = [W];
  public hp: number = 140;
  public weakness = [{ type: M }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Frozen Ground',
    cost: [W, C, C],
    damage: 80,
    text: 'Your opponent can\'t play any Stadium cards from their hand during their next turn.'
  },
  {
    name: 'Skull Bash',
    cost: [W, C, C, C],
    damage: 100,
    text: ''
  }];

  public set: string = 'FLI';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Avalugg';
  public fullName: string = 'Avalugg FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Frozen Ground
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { stadium: true });
    }

    return state;
  }
}
