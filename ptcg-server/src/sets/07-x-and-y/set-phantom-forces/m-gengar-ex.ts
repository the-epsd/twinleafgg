import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { MEGA_EVOLUTION_END_TURN } from '../../../game/store/prefabs/tool-prefabs';
import { COPY_OPPONENT_ACTIVE_AND_BENCH_ATTACK } from '../../../game/store/prefabs/copy-attack-prefabs';

export class MGengarEx extends PokemonCard {
  protected _tags = [CardTag.POKEMON_EX, CardTag.MEGA];
  public stage: Stage = Stage.MEGA;
  public evolvesFrom = 'Gengar-EX';
  public cardType: CardType[] = [P];
  public hp: number = 220;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Phantom Gate',
      cost: [P, C, C],
      damage: 0,
      copycatAttack: true,
      text: "Choose 1 of your opponent's Pokémon's attacks and use it as this attack.",
    },
  ];

  public set: string = 'PHF';
  public name: string = 'M Gengar-EX';
  public fullName: string = 'M Gengar-EX PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    MEGA_EVOLUTION_END_TURN(store, state, effect, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COPY_OPPONENT_ACTIVE_AND_BENCH_ATTACK(store, state, effect as AttackEffect, {
        filter: (_cardList, card) => card.name !== 'M Gengar-EX',
      });
    }

    return state;
  }
}
