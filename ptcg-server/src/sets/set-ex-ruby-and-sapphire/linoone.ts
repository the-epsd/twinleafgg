import { AFTER_ATTACK, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';

export class Linoone extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Zigzagoon';
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Seek Out',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 cards and put them into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Continuous Headbutt',
    cost: [C, C],
    damage: 40,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 40 damage times the number of heads.'
  }];

  public set: string = 'RS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Linoone';
  public fullName: string = 'Linoone RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, {}, { min: 0, max: 2 }, this.attacks[0]);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, effect.player, heads => {
        effect.damage = heads * 40;
      });
    }

    return state;
  }
}