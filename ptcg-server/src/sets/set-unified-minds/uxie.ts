import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, PlayerType } from '../../game';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Uxie extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Secret Territory',
    powerType: PowerType.ABILITY,
    text: 'If you have Mesprit and Azelf in play, apply Weakness for each Pokémon (both yours and your opponent\'s) as \u00d74 instead.'
  }];

  public attacks = [
    {
      name: 'Psyshot',
      cost: [C, C, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '83';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Uxie';
  public fullName: string = 'Uxie UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Secret Territory (passive - modify weakness to x4)
    // Ref: set-phantom-forces/pachirisu.ts (Trick Sticker - CheckPokemonStatsEffect weakness modification)
    if (effect instanceof CheckPokemonStatsEffect) {
      // Find if Uxie is in play and who owns it
      let uxieOwner: any = null;
      state.players.forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          if (cardList.getPokemonCard() === this) {
            uxieOwner = p;
          }
        });
      });

      if (!uxieOwner) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, uxieOwner, this)) {
        return state;
      }

      // Check if owner has Mesprit and Azelf in play
      let hasMesprit = false;
      let hasAzelf = false;

      uxieOwner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: any) => {
        const pokemon = cardList.getPokemonCard();
        if (pokemon && pokemon.name === 'Mesprit') {
          hasMesprit = true;
        }
        if (pokemon && pokemon.name === 'Azelf') {
          hasAzelf = true;
        }
      });

      if (!hasMesprit || !hasAzelf) {
        return state;
      }

      // Duplicate each weakness entry to make x2 become x4 (x2 * x2 = x4)
      const doubled = [...effect.weakness, ...effect.weakness.map(w => ({ type: w.type, value: w.value }))];
      effect.weakness = doubled;
    }

    return state;
  }
}
