import { PokemonCard, PowerType, StateUtils, StoreLike } from '../../../game';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { APPLY_SPECIAL_CONDITION_TO_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/attack-effects';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { CONFIRMATION_PROMPT, HEAL_X_DAMAGE_FROM_THIS_POKEMON, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { State } from '../../../game/store/state/state';

export class Darkrai extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [D];
  public hp: number = 80;
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Darkness Shade',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Darkrai from your hand onto your Bench, you may choose 1 of the Defending Pokémon. That Pokémon is now Asleep.'
  }];

  public attacks = [{
    name: 'Dark Slumber',
    cost: [D],
    damage: 20,
    text: 'At the end of your opponent\'s next turn, the Defending Pokémon is now Asleep.'
  },
  {
    name: 'Dark Resolve',
    cost: [D, D, C],
    damage: 40,
    text: 'If the Defending Pokémon is Asleep, remove 4 damage counters from Darkrai.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Darkrai';
  public fullName: string = 'Darkrai MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Darkness Shade
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            opponent.active,
            [SpecialCondition.ASLEEP],
          );
        }
      });
    }

    // Dark Slumber
    if (WAS_ATTACK_USED(effect, 0, this)) {
      APPLY_SPECIAL_CONDITION_TO_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN(
        store, state, effect, this, SpecialCondition.ASLEEP,
      );
    }

    // Dark Resolve
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 40);
      }
    }

    return state;
  }
}
