import { PokemonCard, Stage, CardTag, CardType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Stunfiskex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_ex];
  public hp: number = 210;
  public cardType: CardType = F;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Big Bite',
      cost: [F],
      damage: 30,
      text: "During your opponent's next turn, the Defending Pokémon can't retreat.",
    },
    {
      name: 'Flopping Trap',
      cost: [F, C, C],
      damage: 100,
      damageCalculation: '+',
      text: 'If this Pokémon has any damage counters on it, this attack does 100 more damage.',
    },
  ];

  public regulationMark = 'J';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '114';
  public name: string = 'Stunfisk ex';
  public fullName: string = 'Stunfisk ex ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Big Bite
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    // Flopping Trap
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (player.active.damage > 0) {
        effect.damage += 100;
      }
    }

    return state;
  }
}
