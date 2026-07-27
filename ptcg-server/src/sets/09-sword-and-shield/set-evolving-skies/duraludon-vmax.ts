import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { GamePhase, State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { StateUtils } from '../../../game/store/state-utils';
import { EnergyCard } from '../../../game';
import { AfterDamageEffect, ApplyWeaknessEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class DuraludonVMAX extends PokemonCard {
  public stage: Stage = Stage.VMAX;
  public tags = [CardTag.POKEMON_VMAX, CardTag.SINGLE_STRIKE];
  public evolvesFrom = 'Duraludon V';
  public cardType: CardType = N;
  public hp: number = 330;
  public weakness = [];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Skyscraper',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokemon by attacks from your opponent\'s Pokémon that have Special Energy attached.'
  }];

  public attacks = [{
    name: 'G-Max Pulverization',
    cost: [F, M, M],
    damage: 220,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  }];

  public regulationMark = 'E';
  public set: string = 'EVS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '123';
  public name: string = 'Duraludon VMAX';
  public fullName: string = 'Duraludon VMAX EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Skyscraper
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this && state.phase === GamePhase.ATTACK) {
      const owner = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const hasSpecialEnergy = effect.source.cards.some(c =>
        c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL
      );

      if (hasSpecialEnergy) {
        effect.preventDefault = true;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 220);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
      return state;
    }

    return state;
  }
}
