import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Ariados extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Spinarak';
  public hp: number = 90;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Hidden Threads',
    powerType: PowerType.ABILITY,
    text: "Your opponent's Pokémon VSTAR's attacks cost Colorless more. You can't apply more than 1 Hidden Threads Ability at a time.",
  }];

  public attacks = [{
    name: 'Pierce',
    cost: [G, C],
    damage: 50,
    text: '',
  }];

  public regulationMark: string = 'F';
  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Ariados';
  public fullName: string = 'Ariados SIT 4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hidden Threads
    if (effect instanceof CheckAttackCostEffect) {
      const attackingPokemonCard = effect.player.active.getPokemonCard();
      if (!attackingPokemonCard || !attackingPokemonCard.hasTag(CardTag.POKEMON_VSTAR)) {
        return state;
      }

      let ariadosPlayer = null;
      for (const p of state.players) {
        if (StateUtils.isPokemonInPlay(p, this)) {
          ariadosPlayer = p;
          break;
        }
      }
      if (!ariadosPlayer) {
        return state;
      }

      if (effect.player === ariadosPlayer) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, ariadosPlayer, this)) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        ariadosPlayer,
        this.powers[0],
        this,
        effect.player.active,
      )) {
        return state;
      }

      const alreadyApplied = (effect as any).__hiddenThreadsApplied;
      if (alreadyApplied) {
        return state;
      }
      (effect as any).__hiddenThreadsApplied = true;

      effect.cost.push(C);
    }

    return state;
  }
}
