import { PokemonCard, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { COIN_FLIPS_FOR_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Lickitung extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Lap Up',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Slam',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Lickitung';
  public fullName: string = 'Lickitung MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lap Up
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(store, state, player, 1);
    }

    // Slam
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIPS_FOR_ATTACK(player.active, 'Slam', 2);
    }

    return state;
  }
}
