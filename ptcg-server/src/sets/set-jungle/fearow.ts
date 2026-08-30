import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN } from '../../game/store/prefabs/effect-of-attack-prefabs';

export class Fearow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Spearow';
  public cardType: CardType[] = [CardType.COLORLESS];
  public hp: number = 70;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public attacks = [{
    name: 'Agility',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, done to Fearow.'
  },
  {
    name: 'Drill Peck',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 40,
    text: ''
  }];

  public set: string = 'JU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';
  public name: string = 'Fearow';
  public fullName: string = 'Fearow JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    return state;
  }
}
