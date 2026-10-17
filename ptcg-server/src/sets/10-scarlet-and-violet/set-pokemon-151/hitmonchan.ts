import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT } from '../../../game/store/prefabs/prefabs';
import { NEXT_TURN_ATTACK_BONUS } from '../../../game/store/prefabs/attack-effects';
import { PowerType, StateUtils } from '../../../game';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';

export class Hitmonchan extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 120;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Counterattack',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon(even if this Pokémon is Knocked Out), put 3 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Excited Punch',
    cost: [F, F],
    damage: 60,
    text: 'During your next turn, this Pokémon\'s Excited Punch attack does 60 more damage (before applying Weakness and Resistance).'
  }];

  public set: string = 'MEW';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Hitmonchan';
  public fullName: string = 'Hitmonchan MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Counterattack
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const abilityOwner = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      const placeCounters = new PlaceDamageCountersEffect(
        abilityOwner,
        effect.source,
        30,
        this,
        this.powers[0],
      );
      store.reduceEffect(state, placeCounters);
    }

    // Excited Punch
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[0],
      source: this,
      bonusDamage: 60
    });

    return state;
  }

}
