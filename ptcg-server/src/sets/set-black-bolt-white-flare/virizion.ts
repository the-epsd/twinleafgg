import { PokemonCard, Stage, CardType, State, StoreLike } from '../../game';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Virizion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Giga Drain',
    cost: [G],
    damage: 30,
    text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
  },
  {
    name: 'Emerald Blade',
    cost: [G, G, C],
    damage: 130,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Virizion';
  public fullName: string = 'Virizion SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const healTime = new HealTargetEffect(effect, effect.damage);
      healTime.target = effect.player.active;
      store.reduceEffect(state, healTime);
    }

    // Emerald Blade
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }
    
    return state;
  }
}