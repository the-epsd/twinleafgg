import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Vaporeon extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Aqua Effect',
      powerType: PowerType.ABILITY,
      text: 'Each of your Stage 1 Pokémon in play is now a [W] Pokémon in addition to its existing types.'
    }
  ];

  public attacks = [
    {
      name: 'Hydro Splash',
      cost: [W, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'AOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Vaporeon';
  public fullName: string = 'Vaporeon AOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard()?.stage === Stage.STAGE_1 && !IS_ABILITY_BLOCKED(store, state, StateUtils.findOwner(state, effect.target), this)) {
      const player = StateUtils.findOwner(state, effect.target);

      let isVaporeonInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isVaporeonInPlay = true;
        }
      });

      if (!isVaporeonInPlay) {
        return state;
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList === effect.target) {
          if (!effect.cardTypes.includes(CardType.WATER)) {
            effect.cardTypes = [...effect.cardTypes, CardType.WATER];
          }
        }
      });
    }

    return state;
  }

}