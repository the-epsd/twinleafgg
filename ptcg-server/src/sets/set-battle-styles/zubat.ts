import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zubat extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Hide in Shadows',
    cost: [C],
    damage: 0,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
  },
  {
    name: 'Speed Dive',
    cost: [C, C],
    damage: 20,
    text: ''
  }
  ];

  public regulationMark = 'E';
  public set: string = 'BST';
  public setNumber: string = '89';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zubat';
  public fullName: string = 'Zubat BST';
  public usedHideInShadows: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedHideInShadows = true;
    }

    if (AFTER_ATTACK(effect) && this.usedHideInShadows) {
      const player = effect.player;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      this.usedHideInShadows = false;
    }
    return state;
  }
}