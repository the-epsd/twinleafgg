import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class PaldeanTauros extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 130;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rear Kick',
    cost: [R],
    damage: 30,
    text: ''
  },
  {
    name: 'Spirited Tackle',
    cost: [R, C, C],
    damage: 90,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is a Stage 1 Pokémon, this attack does 90 more damage.'
  }];

  public set: string = 'SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Paldean Tauros';
  public fullName: string = 'Paldean Tauros SSP';
  public regulationMark = 'H';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.getPokemonCard()?.stage === Stage.STAGE_1) {
        effect.damage += 90;
      }
    }

    return state;
  }

}
