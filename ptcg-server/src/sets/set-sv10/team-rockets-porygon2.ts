import { State, StoreLike } from '../../game';
import { CardType, Stage, CardTag, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';

export class TeamRocketsPorygon2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.TEAM_ROCKET];
  public evolvesFrom = 'Team Rocket\'s Porygon';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Control R',
      cost: [C, C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each Supporter in your discard pile with "Team Rocket" in its name.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '82';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Porygon2';
  public fullName: string = 'Team Rocket\'s Porygon2 SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // Count Team Rocket Supporters in discard pile
      const teamRocketSupporters = player.discard.cards.filter(card =>
        card instanceof TrainerCard &&
        card.name.includes('Team Rocket') &&
        card.trainerType === TrainerType.SUPPORTER
      ).length;

      // Set damage based on count
      effect.damage = 20 * teamRocketSupporters;

      return state;
    }

    return state;
  }
}
