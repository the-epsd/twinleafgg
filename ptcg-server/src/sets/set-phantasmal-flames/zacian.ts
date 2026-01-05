import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zacian extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Limit Break',
    cost: [P, C],
    damage: 50,
    text: 'If your opponent has 3 or fewer Prize cards remaining, this attack does 90 more damage.',
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Zacian';
  public fullName: string = 'Zacian M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent && opponent.getPrizeLeft() <= 3) {
        // Add 90 more damage if opponent has 3 or fewer Prize cards
        effect.damage += 90;
      }
    }
    return state;
  }
}