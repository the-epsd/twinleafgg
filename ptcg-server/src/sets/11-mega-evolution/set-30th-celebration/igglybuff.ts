import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Igglybuff extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 30;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Bouncy Circle',
    cost: [],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each of your Benched Pokémon that has a maximum HP of 30.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '120';
  public name: string = 'Igglybuff';
  public fullName: string = 'Igglybuff 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bouncy Circle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let count = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemon) => {
        if (cardList === player.active) {
          return;
        }

        if (pokemon.hp === 30) {
          count += 1;
        }
      });

      effect.damage = 30 * count;
    }

    return state;
  }
}
