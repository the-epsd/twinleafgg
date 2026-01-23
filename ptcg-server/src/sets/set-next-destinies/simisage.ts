import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Simisage extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pansage';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Collect',
      cost: [G],
      damage: 0,
      text: 'Draw 3 cards.'
    },
    {
      name: 'Stadium Drain',
      cost: [G, C],
      damage: 30,
      damageCalculation: '+',
      text: 'If there is any Stadium card in play, this attack does 30 more damage and heal 30 damage from this Pokemon.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Simisage';
  public fullName: string = 'Simisage NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Collect - draw 3 cards
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 3);
    }

    // Stadium Drain - bonus damage and heal if stadium in play
    if (WAS_ATTACK_USED(effect, 1, this)) {
      // Check if there's a stadium in play
      const stadiumCard = StateUtils.getStadiumCard(state);

      if (stadiumCard !== undefined) {
        effect.damage += 30;
        HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
      }
    }

    return state;
  }
}
