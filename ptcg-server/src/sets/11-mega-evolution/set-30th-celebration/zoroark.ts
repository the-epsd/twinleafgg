import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../../game';
import { CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Zoroark extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Zorua';
  public hp: number = 120;
  public cardType: CardType = D;
  public weakness = [{ type: G }];
  public retreat = [C];
  public powers = [{
    name: 'Night Escape Route',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is on your Bench, your Active Pokémon\'s Retreat Cost is [C][C] less.'
  }];
  public attacks = [{
    name: 'Slash Claw',
    cost: [D, D, C],
    damage: 90,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = 'MF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Zoroark';
  public fullName: string = 'Zoroark MF';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-cosmic-eclipse/bewear.ts (Carry and Run — reduce Active Retreat Cost from Bench)
    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const isBenched = player.bench.some(b => b.cards.includes(this) && b.getPokemonCard() === this);
      if (!isBenched) {
        return state;
      }
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      for (let i = 0; i < 2; i++) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
      }
    }
    return state;
  }
}
