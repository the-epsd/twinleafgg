import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, EnergyCard, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Mandibuzz extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Vullaby';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Dark Pulse',
      cost: [D],
      damage: 20,
      damageCalculation: 'x',
      text: 'Does 20 damage times the number of [D] Energy attached to all of your Pokemon.'
    },
    {
      name: 'Punishment',
      cost: [D, D],
      damage: 40,
      damageCalculation: '+',
      text: 'If the Defending Pokemon has an Ability, this attack does 30 more damage.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Mandibuzz';
  public fullName: string = 'Mandibuzz BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let darkEnergy = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        cardList.cards.forEach(card => {
          if (card instanceof EnergyCard) {
            darkEnergy += card.provides.filter(e => e === CardType.DARK).length;
          }
        });
      });

      (effect as AttackEffect).damage = 20 * darkEnergy;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defendingCard = opponent.active.getPokemonCard();

      if (defendingCard && defendingCard.powers && defendingCard.powers.length > 0) {
        // Check if any power is an Ability
        const hasAbility = defendingCard.powers.some(p => p.powerType === PowerType.ABILITY);
        if (hasAbility) {
          (effect as AttackEffect).damage += 30;
        }
      }
    }

    return state;
  }
}
