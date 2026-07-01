import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StateUtils, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, DISCARD_ALL_ENERGY_FROM_POKEMON } from '../../../game/store/prefabs/prefabs';

export class Koraidon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Battle Claw',
    cost: [F],
    damage: 30,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is an Evolution Pokémon, this attack does 30 more damage.'
  },
  {
    name: 'Gaia Impact',
    cost: [F, F, C],
    damage: 190,
    text: 'Discard all Energy attached to this Pokémon.',
  }];

  public set: string = 'M5';
  public setNumber: string = '45';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Koraidon';
  public fullName: string = 'Koraidon M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-breakthrough/raichu-break.ts (Grand Bolt discard all Energy)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player).active.getPokemonCard();
      if (opponent && opponent.stage !== Stage.BASIC) {
        effect.damage += 30;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, effect.player.active.getPokemonCard()!);
    }

    return state;
  }
}
