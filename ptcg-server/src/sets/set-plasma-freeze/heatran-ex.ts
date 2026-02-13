import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StateUtils, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PlasmaEnergy } from '../set-plasma-storm/plasma-energy';

export class HeatranEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX, CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 180;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Heat Boiler',
      cost: [R, C, C],
      damage: 60,
      damageCalculation: '+' as '+',
      text: 'If this Pokémon is affected by a Special Condition, this attack does 60 more damage.'
    },
    {
      name: 'Dynamite Press',
      cost: [R, R, C, C],
      damage: 80,
      damageCalculation: '+' as '+',
      text: 'If this Pokémon has any Plasma Energy attached to it, this attack does 10 more damage for each damage counter on the Defending Pokémon.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Heatran-EX';
  public fullName: string = 'Heatran-EX PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.active.specialConditions.length > 0) {
        effect.damage += 60;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasPlasmaEnergy = player.active.cards.some(card => card instanceof PlasmaEnergy);
      if (hasPlasmaEnergy) {
        const damageCounters = Math.floor(opponent.active.damage / 10);
        effect.damage += damageCounters * 10;
      }
    }

    return state;
  }
}
