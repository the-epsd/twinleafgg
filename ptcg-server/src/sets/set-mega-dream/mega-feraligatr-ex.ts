import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game';

export class MegaFeraligatrex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Croconaw';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 370;
  public weakness = [{ type: L }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Killer Crunch',
    cost: [W, W, C],
    damage: 200,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokemon has damage counters on it, this attack does 200 more damage.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Mega Feraligatr ex';
  public fullName: string = 'Mega Feraligatr ex M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.damage > 0) {
        effect.damage = 200 + 200;
      } else {
        effect.damage = 200;
      }
    }
    return state;
  }
}