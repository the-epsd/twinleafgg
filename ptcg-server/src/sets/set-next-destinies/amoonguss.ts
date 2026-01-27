import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';

export class Amoonguss extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Foongus';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Sporprise',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand to evolve 1 of your Pokemon, you may use this Ability. If you do, your opponent\'s Active Pokemon is now Confused and Poisoned.'
  }];

  public attacks = [{
    name: 'Rising Lunge',
    cost: [G, C],
    damage: 20,
    text: 'Flip a coin. If heads, this attack does 30 more damage.'
  }];

  public set: string = 'NXD';
  public setNumber: string = '9';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Amoonguss';
  public fullName: string = 'Amoonguss NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sporprise - when evolved, may confuse and poison opponent's active
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Prompt player to use ability
      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), wantToUse => {
        if (wantToUse) {
          const opponent = StateUtils.getOpponent(state, player);
          opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
          opponent.active.addSpecialCondition(SpecialCondition.POISONED);
        }
      });

      return state;
    }

    // Rising Lunge - flip for more damage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 30;
        }
      });
    }

    return state;
  }
}
