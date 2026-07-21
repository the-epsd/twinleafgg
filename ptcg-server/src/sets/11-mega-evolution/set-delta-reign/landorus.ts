import { CardType, PokemonCard, PowerType, Stage, State, StoreLike } from '../../../game';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_A_STADIUM_CARD_IN_PLAY, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { reduceIncarnateUnionEffect } from './incarnate-union';

export class Landorus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C, C];

  public powers = [{
    name: 'Incarnate Union',
    powerType: PowerType.ABILITY,
    text: 'If you have Tornadus, Thundurus, Landorus, and Enamorus in play, ignore all [C] Energy in the cost of attacks used by this Pokémon.',
  }];

  public attacks = [{
    name: 'Gaia Crush',
    cost: [F, C, C],
    damage: 110,
    text: 'Discard a Stadium in play.',
  }];

  public regulationMark: string = 'J';
  public set: string = 'M6';
  public setNumber: string = '40';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Landorus';
  public fullName: string = 'Landorus M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-furious-fists/politoed.ts (King's Song - CheckAttackCostEffect Colorless removal)
    if (effect instanceof CheckAttackCostEffect) {
      return reduceIncarnateUnionEffect(store, state, effect, this);
    }

    // Ref: set-furious-fists/golurk.ts (Wreck)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_A_STADIUM_CARD_IN_PLAY(state);
    }

    return state;
  }
}
