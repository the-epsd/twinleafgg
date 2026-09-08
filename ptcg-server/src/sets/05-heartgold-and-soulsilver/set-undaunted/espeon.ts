import { PlayerType } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { HealTargetEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { COPY_ATTACK_VIA_ABILITY } from '../../../game/store/prefabs/copy-attack-prefabs';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

export class Espeon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType[] = [P];
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Evolution Memories',
    useWhenInPlay: true,
    powerType: PowerType.POKEBODY,
    text: 'Espeon can use the attacks of all Pokémon you have in play that evolve from Eevee as its own. (You still need the necessary Energy to use each attack.)'
  }];

  public attacks = [{
    name: 'Solar Ray',
    cost: [P, C],
    damage: 30,
    text: 'Remove 1 damage counter from each of your Pokémon.'
  }];

  public set: string = 'UD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Espeon';
  public fullName: string = 'Espeon UD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      return COPY_ATTACK_VIA_ABILITY(store, state, effect, {
        copycatCard: this,
        filter: (_cardList, card) => card.evolvesFrom === 'Eevee',
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const healTargetEffect = new HealTargetEffect(effect, 10);
        healTargetEffect.target = cardList;
        state = store.reduceEffect(state, healTargetEffect);
      });
    }
    return state;
  }
}
