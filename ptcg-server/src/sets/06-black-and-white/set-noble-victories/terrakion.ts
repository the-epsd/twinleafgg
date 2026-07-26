import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../../game/store/prefabs/prefabs';

export class Terrakion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Retaliate',
    cost: [F, C],
    damage: 30,
    text: 'If any of your Pokémon were Knocked Out by damage from an opponent\'s attack during his or her last turn, this attack does 60 more damage.'
  },
  {
    name: 'Land Crush',
    cost: [F, F, C],
    damage: 90,
    text: ''
  }];

  public set: string = 'NVI';
  public name: string = 'Terrakion';
  public fullName: string = 'Terrakion NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Retaliate
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(player, { byAttackDamage: true })) {
        effect.damage += 60;
      }
      return state;
    }

    return state;
  }
}