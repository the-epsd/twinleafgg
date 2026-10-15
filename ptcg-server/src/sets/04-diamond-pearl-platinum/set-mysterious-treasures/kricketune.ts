import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Kricketune extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Kricketot';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: 20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sore Performance',
    cost: [C, C],
    damage: 20,
    text: 'The Defending Pokémon is now Asleep.'
  },
{
    name: 'Concerto',
    cost: [G, G],
    damage: 40,
    damageCalculation: '+',
    text: 'Does 40 damage plus 10 more damage for each Kricketot and each Kricketune you have in play.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Kricketune';
  public fullName: string = 'Kricketune MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sore Performance
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    // Concerto
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let evolvedCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card) => {
      if (
      list.getPokemons().length > 1 &&
      card.stage !== Stage.LEGEND &&
      card.stage !== Stage.VUNION &&
      card.stage !== Stage.LV_X
      ) {
      evolvedCount++;
      }
      });
      effect.damage += 10 * evolvedCount;
    }

    return state;
  }
}
