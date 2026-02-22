import { PokemonCard, Stage, CardType, State, StoreLike } from '../../game';

import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Terrakion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Retaliate',
    cost: [F, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 80 more damage.'
  },
  {
    name: 'Land Crush',
    cost: [F, F, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public setNumber: string = '54';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Terrakion';
  public fullName: string = 'Terrakion SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) {
        effect.damage += 80;
      }
      return state;
    }
    return state;
  }
} 