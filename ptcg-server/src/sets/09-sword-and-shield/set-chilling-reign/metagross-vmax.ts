import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_DECK_FOR_CARDS_TO_HAND, NEXT_TURN_ATTACK_BONUS } from '../../../game/store/prefabs/prefabs';

export class MetagrossVmax extends PokemonCard {
  public tags = [CardTag.POKEMON_VMAX, CardTag.RAPID_STRIKE];
  public stage: Stage = Stage.VMAX;
  public evolvesFrom: string = 'Metagross V';
  public cardType: CardType = M;
  public hp: number = 330;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Zap Traction',
    cost: [M],
    damage: 0,
    text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Max Rush',
    cost: [M, C],
    damage: 100,
    text: 'During your next turn, this Pokémon\'s Max Rush attack does 150 more damage.'
  }];

  public regulationMark: string = 'E';
  public set: string = 'CRE';
  public setNumber: string = '113';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Metagross VMAX';
  public fullName: string = 'Metagross VMAX CRE';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Zap Traction
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, {}, { min: 0, max: 2 }, effect);
    }

    // Max Rush
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[1],
      source: this,
      bonusDamage: 150,
    });

    return state;
  }
}
