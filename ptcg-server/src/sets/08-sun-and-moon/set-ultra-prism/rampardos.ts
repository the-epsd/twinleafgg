import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Rampardos extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Cranidos';
  public cardType: CardType = F;
  public hp: number = 150;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Clean Hit',
    cost: [F],
    damage: 60,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is an Evolution Pokémon, this attack does 60 more damage.'
  },
  {
    name: 'Wild Crash',
    cost: [F, F, F],
    damage: 0,
    text: 'If your opponent\'s Active Pokémon is a Basic Pokémon, it is Knocked Out.'
  }];

  public set: string = 'UPR';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rampardos';
  public fullName: string = 'Rampardos UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Clean Hit
    // Ref: set-crimson-invasion/bewear.ts (Cross-Cut - evolution check + more damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();

      if (opponentActive && opponentActive.stage !== Stage.BASIC) {
        effect.damage += 60;
      }
    }

    // Wild Crash
    // Ref: set-black-bolt-white-flare/haxorus.ts (Axe Bomber - KO if Basic)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();

      if (opponentActive && opponentActive.stage === Stage.BASIC) {
        KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        return state;
      }
    }

    return state;
  }
}
