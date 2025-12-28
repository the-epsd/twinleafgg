import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Jolteon extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public powers = [
    {
      name: 'Electric Effect',
      powerType: PowerType.ABILITY,
      text: 'Each of your Stage 1 Pokémon in play is now a [L] Pokémon in addition to its existing types.'
    }
  ];

  public attacks = [
    {
      name: 'Thunder Blast',
      cost: [L, C, C],
      damage: 80,
      text: 'Discard an Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'AOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Jolteon';
  public fullName: string = 'Jolteon AOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard()?.stage === Stage.STAGE_1 && !IS_ABILITY_BLOCKED(store, state, StateUtils.findOwner(state, effect.target), this)) {
      const player = StateUtils.findOwner(state, effect.target);

      let isJolteonInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isJolteonInPlay = true;
        }
      });

      if (!isJolteonInPlay) {
        return state;
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList === effect.target) {
          if (!effect.cardTypes.includes(CardType.LIGHTNING)) {
            effect.cardTypes = [...effect.cardTypes, CardType.LIGHTNING];
          }
        }
      });
    }

    // Thunder Blast
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }

}