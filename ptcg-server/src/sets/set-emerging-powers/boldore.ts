import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Boldore extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Roggenrola';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Smack Down',
      cost: [F, C],
      damage: 20,
      damageCalculation: '+',
      text: 'If the Defending Pokémon has Fighting Resistance, this attack does 60 more damage.'
    },
    {
      name: 'Power Gem',
      cost: [F, F, C, C],
      damage: 80,
      text: ''
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Boldore';
  public fullName: string = 'Boldore EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defendingCard = opponent.active.getPokemonCard();

      if (defendingCard && defendingCard.resistance.some(r => r.type === CardType.FIGHTING)) {
        (effect as AttackEffect).damage += 60;
      }
    }
    return state;
  }
}
