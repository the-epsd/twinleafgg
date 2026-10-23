import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pawmo extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pawmi';
  public hp: number = 90;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Assault Bolt',
    cost: [L, L],
    damage: 50,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon has a Pokémon Tool attached, this attack does 80 more damage.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Pawmo';
  public fullName: string = 'Pawmo FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Assault Bolt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.target.tools.length > 0) {
        effect.damage += 80;
      }
    }

    return state;
  }
}
