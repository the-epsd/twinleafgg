import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, BLOCK_RETREAT } from "../../../game/store/prefabs/prefabs";

export class Scrafty extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Scraggy';
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Corner',
    cost: [D],
    damage: 30,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  },
  {
    name: 'Bad Brawl',
    cost: [D, C, C],
    damage: 90,
    damageCalculation: '+',
    text: 'If you played Piers from your hand during this turn, this attack does 90 more damage.'
  }];

  public regulationMark: string = 'D';
  public set: string = 'CPA';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Scrafty';
  public fullName: string = 'Scrafty CPA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Corner
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    // Bad Brawl
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.playedPiers) {
        effect.damage += 90;
      }
    }

    return state;
  }
}
