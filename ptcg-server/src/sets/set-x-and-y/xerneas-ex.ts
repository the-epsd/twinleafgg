import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class XerneasEX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX];
  public cardType: CardType = Y;
  public hp: number = 170;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Break Through',
    cost: [Y, C, C],
    damage: 60,
    text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'X Blast',
    cost: [Y, Y, C, C],
    damage: 140,
    text: 'This Pokémon can\'t use X Blast during your next turn.'
  }];

  public set: string = 'XY';
  public name: string = 'Xerneas-EX';
  public fullName: string = 'Xerneas-EX XY';
  public setNumber: string = '97';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(30, effect, store, state);
    }

    // X Blast
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('X Blast')) {
        player.active.cannotUseAttacksNextTurnPending.push('X Blast');
      }
    }

    return state;
  }
}