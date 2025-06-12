import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Kirlia extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Ralts';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Flickering Flames',
      cost: [R, C],
      damage: 20,
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Smack',
      cost: [R, C, C],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Kirlia';
  public fullName: string = 'Kirlia DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}