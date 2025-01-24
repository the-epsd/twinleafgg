import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { PlayerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';


export class HisuianArcanine extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Hisuian Growlithe';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 130;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Proud Fangs',
      cost: [],
      damage: 30,
      text: 'If your Benched Pokémon have any damage counters on them, this attack does 90 more damage.'
    },
    {
      name: 'Searing Flame',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 90,
      text: 'Your opponent\'s Active Pokémon is now Burned.'
    }
  ];

  public set: string = 'TWM';

  public setNumber = '100';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Hisuian Arcanine';

  public fullName: string = 'Hisuian Arcanine TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let isThereDamage = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === player.active) {
          return;
        }
        if (cardList.damage > 0) {
          isThereDamage = true;
        }
      });
      if (isThereDamage) {
        effect.damage += 90;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      return store.reduceEffect(state, specialCondition);
    }

    return state;
  }

}
