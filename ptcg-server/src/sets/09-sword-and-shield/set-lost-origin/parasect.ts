import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameMessage, ConfirmPrompt } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EvolveEffect } from '../../../game/store/effects/game-effects';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Parasect extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Paras';
  public hp: number = 120;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Lethargy Spores',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may make both Active Pokémon Asleep and Poisoned.',
  }];

  public attacks = [{
    name: 'X-Scissor',
    cost: [G, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 50 more damage.',
  }];

  public regulationMark: string = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Parasect';
  public fullName: string = 'Parasect LOR 5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lethargy Spores
    if (effect instanceof EvolveEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player);

      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            player.active,
            [SpecialCondition.ASLEEP, SpecialCondition.POISONED],
          );
          APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            opponent.active,
            [SpecialCondition.ASLEEP, SpecialCondition.POISONED],
          );
        }
      });
    }

    // X-Scissor
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 50;
        }
      });
    }

    return state;
  }
}
