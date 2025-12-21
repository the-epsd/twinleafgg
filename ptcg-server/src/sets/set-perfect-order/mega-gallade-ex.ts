import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaGalladeex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Kirlia';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 350;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Gale Cut',
    cost: [F],
    damage: 50,
    damageCalculation: '+',
    text: 'If this Pokémon has any damage counters on it, this attack does 150 more damage.',
  },
  {
    name: 'Marvelous Edge',
    cost: [F, F, C],
    damage: 240,
    text: '',
  }];

  public regulationMark: string = 'J';
  public set: string = 'MEP';
  public setNumber: string = '68';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Gallade ex';
  public fullName: string = 'Mega Gallade ex MEP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gale Cut
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, this)) {
        effect.damage += 150;
      }
    }
    return state;
  }
}