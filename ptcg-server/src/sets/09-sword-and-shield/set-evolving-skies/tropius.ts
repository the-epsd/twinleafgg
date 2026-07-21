import { PokemonCard, Stage, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../../game/store/prefabs/prefabs';

export class Tropius extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = G;
  public hp = 110;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Rally Back',
    cost: [G, C],
    damage: 30,
    text: 'If any of your Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 90 more damage.'
  },
  {
    name: 'Solar Beam',
    cost: [G, G, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'EVS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Tropius';
  public fullName: string = 'Tropius EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rally Back
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(player, { byAttackDamage: true })) {
        effect.damage += 90;
      }
      return state;
    }

    return state;
  }
}