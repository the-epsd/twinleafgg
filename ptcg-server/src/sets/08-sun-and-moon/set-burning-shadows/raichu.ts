import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { PowerType, StateUtils, StoreLike, State } from '../../../game';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import {
  CONFIRMATION_PROMPT,
  IS_ABILITY_BLOCKED,
  JUST_EVOLVED,
  THIS_POKEMON_DOES_DAMAGE_TO_ITSELF,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Raichu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pikachu';
  public hp: number = 110;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Evoshock',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may leave your opponent\'s Active Pokémon Paralyzed.'
  }];

  public attacks = [{
    name: 'Volt Tackle',
    cost: [L, L, C],
    damage: 130,
    text: 'This Pokémon does 30 damage to itself.'
  }];

  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Raichu';
  public fullName: string = 'Raichu BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Evoshock
    if (JUST_EVOLVED(effect, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);
          APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            opponent.active,
            [SpecialCondition.PARALYZED],
          );
        }
      });
    }

    // Volt Tackle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }

    return state;
  }
}
