import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import {WAS_ATTACK_USED, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class MandibuzzEx extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.POKEMON_ex];
  public evolvesFrom: string = 'Vullaby';
  public hp: number = 260;
  public cardType: CardType[] = [D];
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Bone Shot',
    cost: [C, C],
    damage: 0,
    text: 'This attack does 50 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
{
    name: 'Vulture Claw',
    cost: [D, C, C],
    damage: 160,
    text: 'Discard a random card from your opponent\'s hand.'
  }];

  public regulationMark = 'J';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '139';
  public name: string = 'Mandibuzz ex';
  public fullName: string = 'Mandibuzz ex ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bone Shot
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DAMAGE_OPPONENT_POKEMON(store, state, effect, 30, targets);
    }

    // Vulture Claw
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.hand.cards.length > 0) {
      const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
      const card = opponent.hand.cards[randomIndex];
      MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards: [card], sourceCard: this });
      }
    }

    return state;
  }
}
