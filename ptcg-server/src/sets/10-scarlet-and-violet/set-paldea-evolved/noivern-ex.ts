import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Noivernex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Noibat';
  protected _tags = [CardTag.POKEMON_ex];
  public regulationMark = 'G';
  public cardType: CardType = N;
  public hp: number = 260;

  public attacks = [{
    name: 'Covert Flight',
    cost: [C, C],
    damage: 70,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
  },
  {
    name: 'Dominating Echo',
    cost: [P, D],
    damage: 140,
    text: 'During your opponent\'s next turn, they can\'t play any Special Energy or Stadium cards from their hand.'
  }];

  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '153';
  public name: string = 'Noivern ex';
  public fullName: string = 'Noivern ex PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Covert Flight
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceStage: Stage.BASIC });
    }

    // Dominating Echo
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { specialEnergy: true, stadium: true });
    }
    return state;
  }
}
