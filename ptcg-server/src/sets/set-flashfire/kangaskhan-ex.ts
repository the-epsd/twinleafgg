import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class KangaskhanEX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX];
  public cardType: CardType = C;
  public hp: number = 180;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Triple Draw',
    cost: [C],
    damage: 0,
    text: 'Draw 3 cards.'
  },
  {
    name: 'Kindred Kick',
    cost: [C, C, C],
    damage: 70,
    damageCalculator: '+',
    text: 'Flip a coin. If heads, this attack does 30 more damage.'
  }];

  public set: string = 'FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name: string = 'Kangaskhan-EX';
  public fullName: string = 'Kangaskhan-EX FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 3);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
    }

    return state;
  }

}
