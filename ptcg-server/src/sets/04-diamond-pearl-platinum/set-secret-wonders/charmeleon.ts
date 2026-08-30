import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Charmeleon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Charmander';
  public hp: number = 80;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: 20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Fire Fang',
    cost: [R],
    damage: 20,
    text: 'The Defending Pokémon is now Burned.'
  },
  {
    name: 'Flare Tail',
    cost: [R, R, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, discard a Fire Energy attached to Charmeleon and this attack does 50 damage plus 20 more damage.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Charmeleon';
  public fullName: string = 'Charmeleon SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fire Fang
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }

    // Flare Tail
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 20;
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    return state;
  }
}
