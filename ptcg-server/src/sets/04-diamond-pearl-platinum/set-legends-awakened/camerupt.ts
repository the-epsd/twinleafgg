import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { CardList, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Camerupt extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Numel';
  public hp: number = 100;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Eruption',
    cost: [R, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Each player discards the top of his or her deck. This attack does 30 damage plus 30 more damage for each Energy card discarded in this way.'
  },
  {
    name: 'Take Down',
    cost: [R, C, C],
    damage: 80,
    text: 'Camerupt does 20 damage to itself.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Camerupt';
  public fullName: string = 'Camerupt LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Eruption
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const playerTop = new CardList();
      const opponentTop = new CardList();
      let bonus = 0;
      if (player.deck.cards.length > 0) {
        MOVE_CARDS(store, state, player.deck, playerTop, { count: 1, sourceCard: this });
        if (playerTop.cards[0]?.superType === SuperType.ENERGY) {
          bonus += 30;
        }
        MOVE_CARDS(store, state, playerTop, player.discard, { sourceCard: this });
      }
      if (opponent.deck.cards.length > 0) {
        MOVE_CARDS(store, state, opponent.deck, opponentTop, { count: 1, sourceCard: this });
        if (opponentTop.cards[0]?.superType === SuperType.ENERGY) {
          bonus += 30;
        }
        MOVE_CARDS(store, state, opponentTop, opponent.discard, { sourceCard: this });
      }
      effect.damage += bonus;
    }

    // Take Down
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
    }

    return state;
  }
}
