import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Fuecocoex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public hp: number = 210;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Singe',
    cost: [R],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Burned.'
  },
  {
    name: 'Cheerful Flame',
    cost: [R, R, C],
    damage: 70,
    damageCalculation: 'x',
    text: 'This attack does 70 damage for each Prize card you have taken.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Fuecoco ex';
  public fullName: string = 'Fuecoco ex 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Singe
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }

    // Cheerful Flame
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const prizesTaken = 6 - effect.player.getPrizeLeft();
      effect.damage = prizesTaken * 70;
    }

    return state;
  }
}
