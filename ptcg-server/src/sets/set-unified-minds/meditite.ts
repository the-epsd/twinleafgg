import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Meditite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Spirited Headbutt',
    cost: [F],
    damage: 40,
    text: 'This Pokémon can\'t use Spirited Headbutt during your next turn.'
  }];

  public set: string = 'UNM';
  public name: string = 'Meditite';
  public fullName: string = 'Meditite UNM';
  public setNumber: string = '109';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Spirited Headbutt')) {
        player.active.cannotUseAttacksNextTurnPending.push('Spirited Headbutt');
      }
    }

    return state;
  }
}