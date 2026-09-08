import { CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Groudon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 150;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Strength',
    cost: [F, C],
    damage: 40,
    text: ''
  },
  {
    name: 'Savage Ground',
    cost: [F, F, C],
    damage: 0,
    damageCalculation: '+',
    text: 'If there is a Stadium in play with "Legendary" in its name, this attack does 170 more damage.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M6';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Groudon';
  public fullName: string = 'Groudon M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Savage Ground
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const stadium = StateUtils.getStadiumCard(state);

      if (stadium && stadium.name.includes('Legendary')) {
        effect.damage += 170;
      }
    }

    return state;
  }
}