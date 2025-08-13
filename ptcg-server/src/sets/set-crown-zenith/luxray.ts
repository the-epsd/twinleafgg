import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';


export class Luxray extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.STAGE_2;

  public tags = [CardTag.PLAY_DURING_SETUP];

  public evolvesFrom = 'Luxio';

  public cardType: CardType = L;

  public hp: number = 160;

  public weakness = [{ type: F }];

  public retreat = [];

  public powers = [{
    name: 'Explosiveness',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in your hand when you are setting up to play, you may put it face down as your Active Pokémon.'
  }];

  public attacks = [{

    name: 'Seeking Fang',
    cost: [C],
    damage: 50,
    text: 'Search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Then, shuffle your deck.'
  }];

  public set: string = 'CRZ';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '44';

  public name: string = 'Luxray';

  public fullName: string = 'Luxray CRZ';



  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, { superType: SuperType.TRAINER }, { min: 0, max: 2 }, this.attacks[0]);
    }
    return state;
  }
}