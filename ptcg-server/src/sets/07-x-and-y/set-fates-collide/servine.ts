import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { GameMessage, PowerType, StateUtils, StoreLike, State } from '../../../game';
import { ConfirmPrompt } from '../../../game/store/prompts/confirm-prompt';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED } from '../../../game/store/prefabs/prefabs';

export class Servine extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snivy';
  public hp: number = 70;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Serpentine Strangle',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon, you may flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public attacks = [{
    name: 'Vine Whip',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public set: string = 'FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Servine';
  public fullName: string = 'Servine FCO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Serpentine Strangle
    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player);

      store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), result => {
        if (!result) {
          return;
        }

        COIN_FLIP_PROMPT(store, state, player, flipResult => {
          if (flipResult) {
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
      });
    }

    return state;
  }
}
