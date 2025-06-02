import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
// Energy type constants (R, C, W) are assumed to be globally available as in Larvesta

export class Volcarona extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Larvesta';
  public cardType = R;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Heat Wave Scales',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may discard a Basic [R] Energy card from your hand in order to leave your opponent\'s Active Pokémon Burned.'
  }];

  public attacks = [{
    name: 'Fire Wing',
    cost: [R, C, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'SV11B';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Volcarona';
  public fullName: string = 'Volcarona SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability and attack effects would be implemented here if needed
    return state;
  }
} 