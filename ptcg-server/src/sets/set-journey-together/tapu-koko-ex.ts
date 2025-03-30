import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TapuKokoex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public regulationMark = 'H';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 200;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [
    {
      name: 'Thunder Connect',
      cost: [L, C],
      damage: 60,
      damageCalculation: '+',
      text: 'This attack does 20 more damage for each of your Benched Pokémon.'
    },
  ];

  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Tapu Koko ex';
  public fullName: string = 'Tapu Koko ex JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this))
      effect.damage += (effect.player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0) * 20);

    return state;
  }
}