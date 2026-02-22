import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gourgeistex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pumpkaboo';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 270;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Horror Rondo',
    cost: [P],
    damage: 30,
    damageCalculation: '+' as '+',
    text: 'This attack does 50 more damage for each of your Benched Pokemon that have any damage counters on them.'
  },
  {
    name: 'Ghost Touch',
    cost: [P, P],
    damage: 140,
    text: 'Discard a random card from your opponent\'s hand.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Gourgeist ex';
  public fullName: string = 'Gourgeist ex M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let benchWithDamageCount = 0;
      player.bench.forEach(slot => {
        if (slot.cards.length > 0 && slot.damage > 0) {
          benchWithDamageCount++;
        }
      });

      effect.damage += 50 * benchWithDamageCount;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.hand.cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const randomCard = opponent.hand.cards[randomIndex];
        opponent.hand.moveCardTo(randomCard, opponent.discard);
      }
    }

    return state;
  }
}
