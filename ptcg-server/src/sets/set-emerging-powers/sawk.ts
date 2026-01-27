import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Sawk extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Five Fierce Chops',
      cost: [F, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip 5 coins. This attack does 20 damage times the number of heads. This Pokémon can\'t attack during your next turn.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Sawk';
  public fullName: string = 'Sawk EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 5, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        (effect as AttackEffect).damage = 20 * heads;
      });

      player.active.cannotAttackNextTurnPending = true;
    }
    return state;
  }
}
