import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lairon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.METAL;
  public hp: number = 90;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom: string = 'Aron';

  public attacks = [{
    name: 'Rigidify',
    cost: [CardType.METAL],
    damage: 0,
    text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks(after applying Weakness and Resistance).'
  },
  {
    name: 'Headbutt',
    cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
    damage: 70,
    text: ''
  }];

  public set = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '124';
  public name = 'Lairon';
  public fullName = 'Lairon UNB';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 30;
    }

    return state;
  }

}