import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_RETREAT, NEXT_TURN_ATTACK_BONUS } from '../../../game/store/prefabs/prefabs';

export class Pidgeot extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Pidgeotto';
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];


  public attacks = [{
    name: 'Clutch',
    cost: [C, C],
    damage: 40,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Strong Gust',
    cost: [C, C, C],
    damage: 60,
    text: 'During your next turn, this Pokémon\'s Strong Gust attack does 60 more damage (before applying Weakness and Resistance).'
  }];

  public set: string = 'FLF';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pidgeot';
  public fullName: string = 'Pidgeot FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Clutch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      BLOCK_RETREAT(store, state, effect, this);
    }
    // Strong Gust
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[1],
      source: this,
      bonusDamage: 60,
    });

    return state;
  }
}
