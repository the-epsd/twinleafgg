import { PowerType, StateUtils, StoreLike, State } from '../../../game';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gastly';
  public hp: number = 70;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Gothic Fear',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon, you may leave both Active Pokémon Confused.'
  }];

  public attacks = [{
    name: 'Poison Ring',
    cost: [P, C],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. That Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'BKT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Haunter';
  public fullName: string = 'Haunter BKT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gothic Fear
    if (JUST_EVOLVED(effect, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) {
          return state;
        }

        APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
          store,
          state,
          player,
          this.powers[0],
          this,
          player.active,
          [SpecialCondition.CONFUSED],
        );
        APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
          store,
          state,
          player,
          this.powers[0],
          this,
          opponent.active,
          [SpecialCondition.CONFUSED],
        );
      });
    }

    // Poison Ring
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
