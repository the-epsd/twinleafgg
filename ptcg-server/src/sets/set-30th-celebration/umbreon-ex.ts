import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Umbreonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.POKEMON_ex];
  public evolvesFrom: string = 'Eevee';
  public hp: number = 270;
  public cardType: CardType = D;
  public weakness = [{ type: G }];
  public retreat = [C, C];
  public attacks = [{
    name: 'Lunatic Claw',
    cost: [D, C],
    damage: 100,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon has any damage counters on it, this attack does 140 more damage.'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Umbreon ex';
  public fullName: string = 'Umbreon ex 30C';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-battle-styles/luxray.ts (Scar Strikes — bonus damage if opponent's Active has damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.active.damage > 0) {
        effect.damage += 140;
      }
    }
    return state;
  }
}
