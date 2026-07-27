import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Clamperl extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Shell Press',
    cost: [W],
    damage: 10,
    text: 'During your opponent\'s next turn, this Pokémon takes 10 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '54';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Clamperl';
  public fullName: string = 'Clamperl DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shell Press
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 10;
    }

    return state;
  }
}
