import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class RegigigasEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 180;
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Giga Power',
      cost: [C, C, C],
      damage: 60,
      damageCalculation: '+',
      text: 'You may do 20 more damage. If you do, this Pokémon does 20 damage to itself.'
    },
    {
      name: 'Raging Hammer',
      cost: [C, C, C, C],
      damage: 50,
      damageCalculation: '+',
      text: 'Does 10 more damage for each damage counter on this Pokémon.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '82';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Regigigas-EX';
  public fullName: string = 'Regigigas-EX NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Giga Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_DEAL_MORE_DAMAGE
      ), result => {
        if (result) {
          (effect as AttackEffect).damage += 20;
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
        }
      });
    }

    // Raging Hammer
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const damageCounters = Math.floor(player.active.damage / 10);
      effect.damage += damageCounters * 10;
    }

    return state;
  }
}
