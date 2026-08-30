import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Toxel2 extends PokemonCard {
  protected _tags = [CardTag.FUSION_STRIKE];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Growl',
      cost: [C],
      damage: 0,
      text: "During your opponent's next turn, the Defending Pokémon's attacks do 30 less damage (before applying Weakness and Resistance).",
    },
    {
      name: 'Tiny Bolt',
      cost: [L],
      damage: 10,
      text: '',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '106';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Toxel';
  public fullName: string = 'Toxel FST 106';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Growl
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 30);
    }

    return state;
  }
}
