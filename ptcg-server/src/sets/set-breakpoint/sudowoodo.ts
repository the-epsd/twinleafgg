import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COPY_OPPONENTS_LAST_ATTACK } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Sudowoodo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Watch and Learn',
    cost: [F, C],
    damage: 0,
    copycatAttack: true,
    text: 'If your opponent\'s Pokémon used an attack during his or her last turn, use it as this attack.'
  }];

  public set: string = 'BKP';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sudowoodo';
  public fullName: string = 'Sudowoodo BKP';

  // Ref: set-team-up/mimikyu.ts (Copycat)
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COPY_OPPONENTS_LAST_ATTACK(store, state, effect as AttackEffect);
    }

    return state;
  }
}
