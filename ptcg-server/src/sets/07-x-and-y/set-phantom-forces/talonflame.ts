import { CardType, PokemonCard, Stage, State, StoreLike } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from "../../../game/store/prefabs/prefabs";

export class Talonflame extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Fletchinder';
  public cardType: CardType = R;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Acrobatics',
    cost: [R],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip 2 coins. This attack does 30 more damage for each heads.'
  },
  {
    name: 'Jet Shoot',
    cost: [R, R, C],
    damage: 120,
    text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is increased by 40 (after applying Weakness and Resistance).'
  }];

  public set: string = 'PHF';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Talonflame';
  public fullName: string = 'Talonflame PHF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Acrobatics
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage += 30 * heads;
      });
    }

    // Jet Shoot
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = -40;
    }

    return state;
  }
}
