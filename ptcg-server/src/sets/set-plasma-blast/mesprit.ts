import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';

export class Mesprit extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Mental Shroud',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'If you have Uxie and Azelf in play, each of your Pokémon has no Weakness.'
  }];

  public attacks = [
    {
      name: 'Psyshot',
      cost: [P, C, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mesprit';
  public fullName: string = 'Mesprit PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Mental Shroud - passive, intercept CheckPokemonStatsEffect
    if (effect instanceof CheckPokemonStatsEffect) {
      // Find who owns this Mesprit and if it's in play
      let mespritOwner: any = null;

      state.players.forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          if (cardList.getPokemonCard() === this) {
            mespritOwner = p;
          }
        });
      });

      if (!mespritOwner) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, mespritOwner, this)) {
        return state;
      }

      // Check if the target Pokemon belongs to the same player
      let targetOwner: any = null;
      state.players.forEach(p => {
        if (p.active === effect.target || p.bench.includes(effect.target)) {
          targetOwner = p;
        }
      });

      if (targetOwner !== mespritOwner) {
        return state;
      }

      // Check if Uxie and Azelf are in play on our side
      let hasUxie = false;
      let hasAzelf = false;

      mespritOwner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: any) => {
        const pokemon = cardList.getPokemonCard();
        if (pokemon && pokemon.name === 'Uxie') {
          hasUxie = true;
        }
        if (pokemon && pokemon.name === 'Azelf') {
          hasAzelf = true;
        }
      });

      if (hasUxie && hasAzelf) {
        effect.weakness = [];
      }
    }

    return state;
  }
}
