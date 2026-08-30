import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED, FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../../game/store/prefabs/prefabs';

export class Gyarados extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Magikarp';
  public cardType: CardType[] = [W];
  public hp: number = 170;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Wreak Havoc',
    cost: [C],
    damage: 0,
    text: 'Flip a coin until you get tails. For each heads, discard the top 2 cards of your opponent\'s deck.'
  }, {
    name: 'Wild Splash',
    cost: [W, W, C, C],
    damage: 230,
    text: 'Discard the top 5 cards of your deck.'
  }];

  public regulationMark = 'F';

  public set: string = 'PGO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Gyarados';
  public fullName: string = 'Gyarados PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wreak Havoc
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: (heads * 2), sourceCard: this, sourceEffect: this.attacks[0] });
    });
    }

    // Raging Fin
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      MOVE_CARDS(store, state, player.deck, player.discard, { count: 5 });
    }

    return state;
  }
}