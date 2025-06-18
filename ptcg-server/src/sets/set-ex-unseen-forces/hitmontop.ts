import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PowerType, StateUtils } from '../../game';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class Hitmontop extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Stages of Evolution',
    powerType: PowerType.POKEBODY,
    text: 'As long as Hitmontop is an Evolved Pokémon, is your Active Pokémon, and is damaged by an opponent\'s attack(even if Hitmontop is Knocked Out), put 2 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Upward Kick',
    cost: [F, C],
    damage: 20,
    damageCalculation: '+',
    text: 'If the Defending Pokémon already has at least 2 damage counters on it, this attack does 20 damage plus 30 more damage.'
  },
  {
    name: 'Spiral Kick',
    cost: [C, C, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Hitmontop';
  public fullName: string = 'Hitmontop UF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterDamageEffect && effect.target.getPokemonCard() === this && state.phase === GamePhase.ATTACK) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = effect.player;
      if (player === opponent || player.active !== effect.target)
        return state;

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.target.getPokemons().length > 1) {
        effect.source.damage += 20;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.damage >= 20) {
        effect.damage += 30;
      }
    }

    return state;
  }

}
