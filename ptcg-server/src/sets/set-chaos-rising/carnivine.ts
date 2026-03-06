import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Carnivine extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 110;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Chomp Down',
    cost: [C, C, C],
    damage: 80,
    damageCalculation: '+' as '+',
    text: 'If your opponent\'s Active Pokemon has no Retreat Cost, this attack does 80 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Carnivine';
  public fullName: string = 'Carnivine M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.retreat.length === 0) {
        effect.damage += 80;
      }
    }
    return state;
  }
}
