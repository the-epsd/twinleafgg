import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Registeel extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Exoskeleton',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon takes 20 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Silver Fist',
    cost: [M, C, C],
    damage: 60,
    text: 'If your opponent\'s Active Pokémon has an Ability, this attack does 60 more damage.'
  }];

  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Registeel';
  public fullName: string = 'Registeel CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.target.getPokemonCard() === this) {
      if (IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      effect.damage -= 20;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();

      if (opponentActive && opponentActive.powers.some(power => power.powerType === PowerType.ABILITY)) {
        if (!IS_ABILITY_BLOCKED(store, state, opponent, opponentActive)) {
          THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, 60);
        }
      }
    }

    return state;
  }
}