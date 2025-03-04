import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class MistysStarmie extends PokemonCard {
  public tags = [ CardTag.MISTYS ];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Misty\'s Staryu';
  public regulationMark = 'I';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [ C ];

  public attacks = [{
    name: 'Sudden Flash',
    cost: [ W ],
    damage: 60,
    damageCalculation: '+',
    text: 'If this Pokémon evolved from Misty\'s Staryu during this turn, this attack does 80 more damage.'
  }];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Misty\'s Starmie';
  public fullName: string = 'Misty\'s Starmie SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sudden Flash
    if (WAS_ATTACK_USED(effect, 0, this)){
      if (effect.player.active.pokemonPlayedTurn === state.turn) {
        effect.damage += 80;
      }
    }

    return state;
  }
}