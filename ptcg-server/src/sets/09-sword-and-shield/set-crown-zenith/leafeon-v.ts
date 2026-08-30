import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class LeafeonV extends PokemonCard {
  protected _tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 210;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Leaf Guard',
    cost: [G],
    damage: 30,
    text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  },
  {
    name: 'Slashing Strike',
    cost: [G, G, C],
    damage: 180,
    text: 'During your next turn, this Pokémon can\'t use Slashing Strike.'
  }];

  public regulationMark: string = 'F';
  public set: string = 'CRZ';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Leafeon V';
  public fullName: string = 'Leafeon V CRZ 13';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Leaf Guard
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 30;
    }

    // Slashing Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotUseAttacksNextTurnPending.push('Slashing Strike');
    }

    return state;
  }
}
