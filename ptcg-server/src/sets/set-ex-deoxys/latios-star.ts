import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class LatiosStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.STAR]
  public cardType: CardType = C;
  public hp: number = 80;
  public weakness = [{ type: C }];
  public resistance = [{ type: G, value: -30 }, { type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Miraculous Light',
      cost: [C],
      damage: 10,
      text: 'Remove 1 damage counter and all Special Conditions from Latios Star.'
    },
    {
      name: 'Shining Star',
      cost: [G, L, P],
      damage: 50,
      damageCalculation: '+',
      text: 'If the Defending Pokémon is a Stage 2 Evolved Pokémon, discard all Energy cards attached to Latios Star and this attack does 50 damage plus 100 more damage.'
    }
  ];

  public set: string = 'DX';
  public name: string = 'Latios Star';
  public fullName: string = 'Latios Star DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 10);

      const removeSpecialCondition = new RemoveSpecialConditionsEffect(effect, undefined);
      removeSpecialCondition.target = player.active;
      state = store.reduceEffect(state, removeSpecialCondition);
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const defending = opponent.active;

      if (defending.getPokemonCard()?.stage === Stage.STAGE_2 && defending.getPokemons().length > 1) {
        DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
        effect.damage += 100;
      }
    }

    return state;
  }

}
