import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Hawlucha extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Revenge Kick',
    cost: [F],
    damage: 30,
    text: 'If your Benched Pokemon have any damage counters on them, this attack does 60 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Hawlucha';
  public fullName: string = 'Hawlucha M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if any Benched Pokemon have damage
      let hasDamagedBench = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList !== player.active && cardList.damage > 0) {
          hasDamagedBench = true;
        }
      });

      if (hasDamagedBench) {
        effect.damage += 60;
      }
    }

    return state;
  }
}
