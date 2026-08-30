import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_ITEM_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';

export class Venomoth extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Venonat';
  public cardType: CardType[] = [G];
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Perplexing Powder',
    cost: [G],
    damage: 30,
    text: 'Your opponent\'s Active Pokémon is now Confused. During your opponent\'s next turn, they can\'t play any Item cards from their hand.',
  },
  {
    name: 'Speed Wing',
    cost: [G, C, C],
    damage: 90,
    text: '',
  }];

  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Venomoth';
  public fullName: string = 'Venomoth MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Perplexing Powder
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
      return OPPONENT_CANNOT_PLAY_ITEM_CARDS(store, state, effect, this);
    }
    return state;
  }
}
