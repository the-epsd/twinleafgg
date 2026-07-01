import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import {
  GameMessage,
  StoreLike,
  State,
  ChoosePokemonPrompt,
  PlayerType,
  SlotType,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { countHideNSneakPokemonInDiscard } from './hide-n-sneak';

export class Spiritomb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Soul End',
      cost: [P],
      damage: 0,
      text: "If you have 13 or more Pokémon in your discard with the Hide 'n' Sneak Ability, choose 2 of your opponent's Pokémon and quadruple the number of damage counters on each of them.",
    },
  ];

  public set: string = 'M5';
  public setNumber: string = '33';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Spiritomb';
  public fullName: string = 'Spiritomb M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-dark-explorers/kyogre-ex.ts (Dual Splash — choose opponent Pokémon incl. Active)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      effect.damage = 0;

      if (countHideNSneakPokemonInDiscard(player) < 13) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 2, max: 2, allowCancel: false },
        ),
        (selected) => {
          const targets = selected || [];
          targets.forEach((target) => {
            const current = target.damage;
            if (current <= 0) {
              return;
            }
            const add = current * 3;
            store.reduceEffect(state, new PlaceDamageCountersEffect(player, target, add, this));
          });
        },
      );
    }

    return state;
  }
}
