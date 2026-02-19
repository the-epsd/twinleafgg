import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dragapult extends PokemonCard {
  public regulationMark: string = 'E';
  public tags = [ CardTag.FUSION_STRIKE ];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Drakloak';
  public cardType: CardType = P;
  public hp: number = 150;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ ];

  public attacks = [{
    name: 'Fusion Strike Assault',
    cost: [P],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each of your Fusion Strike Pokémon in play.'
  },
  {
    name: 'Speed Attack',
    cost: [P, C],
    damage: 120,
    text: ''
  }];

  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '130';
  public name: string = 'Dragapult';
  public fullName: string = 'Dragapult (FST 130)';
  public legacyFullName = 'Dragapult FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const playerBench = player.bench;

      let fusionStrikeCount = 0;

      playerBench.forEach(c => {
        if (c.getPokemonCard() instanceof PokemonCard) {
          if (c.getPokemonCard()?.tags?.includes(CardTag.FUSION_STRIKE)) {
            fusionStrikeCount++;
          }
        }
      });

      // Include the active Pokémon if it's fusion strike
      if (player.active.getPokemonCard()?.tags?.includes(CardTag.FUSION_STRIKE)) {
        fusionStrikeCount++;
      }

      // Set the damage based on the count of fusion strike Pokémon
      effect.damage = 30 * fusionStrikeCount;

      return state;
    }
    return state;
  }
}
