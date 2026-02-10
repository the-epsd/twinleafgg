import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zoroark extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Zorua';

  public cardType: CardType = CardType.DARK;

  public hp: number = 100;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Brutal Bash',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      damageCalculation: 'x',
      text: 'Does 20 damage times the number of Darkness Pokemon you have in play.'
    },
    {
      name: 'Dark Rush',
      cost: [CardType.DARK, CardType.DARK],
      damage: 0,
      damageCalculation: 'x',
      text: 'Does 20 damage times the number of damage counters on this Pokemon.'
    }
  ];

  public set: string = 'DEX';

  public name: string = 'Zoroark';

  public fullName: string = 'Zoroark DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '71';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Brutal Bash - damage based on Dark Pokemon in play
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let darkPokemonCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.cardType === CardType.DARK) {
          darkPokemonCount++;
        }
      });

      (effect as AttackEffect).damage = 20 * darkPokemonCount;
    }

    // Dark Rush - damage based on damage counters on this Pokemon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      // Damage counters = damage / 10
      const damageCounters = player.active.damage / 10;
      (effect as AttackEffect).damage = 20 * damageCounters;
    }

    return state;
  }

}
