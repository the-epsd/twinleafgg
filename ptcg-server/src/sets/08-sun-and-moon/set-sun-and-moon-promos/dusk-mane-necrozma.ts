import { CardType, PokemonCard, Stage, State, StateUtils, StoreLike } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from "../../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

export class DuskManeNecrozma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType = M;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Dusk Shot',
    cost: [M],
    damage: 0,
    text: 'This attack does 60 damage to 1 of your opponent\'s Pokémon-GX or Pokémon-EX. This damage isn\'t affected by Weakness or Resistance.'
  },
  {
    name: 'Rusty Claws',
    cost: [M, M, C],
    damage: 100,
    damageCalculation: '+',
    text: 'If your opponent has exactly 1 Prize card remaining, this attack does 100 more damage.'
  }];

  public set: string = 'SMP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Dusk Mane Necrozma';
  public fullName: string = 'Dusk Mane Necrozma SMP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dusk Shot
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(60, effect, store, state);
    }

    // Rusty Claws
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.getPrizeLeft() === 1) {
        effect.damage += 100;
      }
    }

    return state;
  }
}
