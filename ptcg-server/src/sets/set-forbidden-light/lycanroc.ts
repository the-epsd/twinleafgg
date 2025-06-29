import { Attack, CardType, PokemonCard, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lycanroc extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Rockruff';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness: Weakness[] = [{ type: G }];
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [{
    name: 'Dangerous Rogue',
    cost: [F, C],
    damage: 20,
    damageCalculation: '+',
    text: 'This attack does 20 more damage for each of your opponent\'s Benched Pokémon.'
  },
  {
    name: 'Accelerock',
    cost: [F, F, C],
    damage: 100,
    text: ''
  }];

  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';
  public name: string = 'Lycanroc';
  public fullName: string = 'Lycanroc FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.damage += (opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0) * 20);
    }

    return state;
  }
}