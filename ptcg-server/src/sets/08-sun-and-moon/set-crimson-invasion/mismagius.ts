import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Mismagius extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Misdreavus';
  public cardType: CardType[] = [P];
  public hp: number = 110;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Chaos Wheel',
    cost: [P],
    damage: 30,
    text: 'Your opponent can\'t play any Pokémon Tool, Special Energy, or Stadium cards from their hand during their next turn.'
  },
  {
    name: 'Dark Arts',
    cost: [P, C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'This attack does 20 damage for each card in your opponent\'s hand.'
  }];

  public set: string = 'CIN';
  public setNumber: string = '40';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mismagius';
  public fullName: string = 'Mismagius CIN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Chaos Wheel
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, {
        tool: true,
        specialEnergy: true,
        stadium: true,
      });
    }

    // Dark Arts
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      effect.damage = 20 * opponent.hand.cards.length;
    }

    return state;
  }
}
