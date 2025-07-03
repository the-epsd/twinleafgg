import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';

export class Wailordex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wailmer';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 200;
  public weakness = [{ type: G }, { type: L }];
  public retreat = [C, C, C, C, C];

  public attacks = [{
    name: 'Super Deep Dive',
    cost: [C],
    damage: 0,
    text: 'If you don\'t have any Benched Pokémon, this attack does nothing. Remove 3 damage counters from Wailord ex. Switch Wailord ex with 1 of your Benched Pokémon.'
  },
  {
    name: 'Dwindling Wave',
    cost: [W, W, W, C],
    damage: 100,
    damageCalculation: '-',
    text: 'Does 100 damage minus 10 damage for each damage counter on Wailord ex.'
  }];

  public set: string = 'SS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Wailord ex';
  public fullName: string = 'Wailord ex SS';

  public usedSuperDeepDive = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      if (playerBench === 0) {
        return state;
      }

      const healEffect = new HealEffect(player, player.active, 30);
      store.reduceEffect(state, healEffect);

      this.usedSuperDeepDive = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedSuperDeepDive) {
      this.usedSuperDeepDive = false;
      const player = effect.player;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage = Math.max(0, 100 - effect.player.active.damage);
    }

    return state;
  }
}