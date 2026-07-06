import { PokemonCard, Stage, CardType, StoreLike, State, CardTag } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class TeamRocketsKangaskhanex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET, CardTag.POKEMON_ex];
  public cardType: CardType = C;
  public hp: number = 230;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Comet Punch',
    cost: [C, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 4 coins. This attack does 30 damage for each heads.'
  },
  {
    name: 'Wicked Impact',
    cost: [C, C, C],
    damage: 120,
    damageCalculation: '+',
    text: 'If you played a Supporter card that has "Team Rocket" in its name from your hand during this turn, this attack does 100 more damage.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '162';
  public name: string = 'Team Rocket\'s Kangaskhan ex';
  public fullName: string = 'Team Rocket\'s Kangaskhan ex ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Comet Punch
    // Ref: set-plasma-blast/kangaskhan.ts (Comet Punch)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 4, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 30 * heads;
      });
    }

    // Attack 2: Wicked Impact
    // Ref: set-destined-rivals/team-rockets-factory.ts (rocketSupporter)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.rocketSupporter) {
        effect.damage += 100;
      }
    }

    return state;
  }
}
