import { State, StateUtils, StoreLike } from '../../../game';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class FlareonStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Crimson Ray',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Flareon Star from your hand onto your Bench, you may use this power. Each Active Pokémon (both yours and your opponent\'s) is now Burned.',
  }];

  public attacks = [{
    name: 'Flamethrower',
    cost: [R, R, C],
    damage: 50,
    text: 'Discard a [R] Energy attached to Flareon Star.',
  }];

  public set: string = 'PK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Flareon Star';
  public fullName: string = 'Flareon Star PK';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Crimson Ray
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }
        APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
          store,
          state,
          player,
          this.powers[0],
          this,
          player.active,
          [SpecialCondition.BURNED],
        );
        APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
          store,
          state,
          player,
          this.powers[0],
          this,
          opponent.active,
          [SpecialCondition.BURNED],
        );
      });
    }

    // Flamethrower
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.FIRE);
    }

    return state;
  }
}
