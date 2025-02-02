import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Torterra extends PokemonCard {
  public regulationMark: string = 'F';
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Grotle';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 190;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Evopress',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 50,
    damageCalculation: 'x',
    text: 'This attack does 50 for each of your Evolution Pokemon in play.'
  },
  {
    name: 'Hammer In',
    cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 160,
    text: ''
  }];

  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Torterra';
  public fullName: string = 'Torterra BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const playerBench = player.bench;

      let evolutionPokemonCount = 0;

      playerBench.forEach(c => {
        if (c.getPokemonCard() instanceof PokemonCard) {
          if (c.getPokemonCard()?.stage !== Stage.BASIC) {
            evolutionPokemonCount++;
          }
        }
      });

      // Don't forget to include the active Pokémon if it's not basic
      if (player.active.getPokemonCard()?.stage !== Stage.BASIC) {
        evolutionPokemonCount++;
      }

      // Set the damage based on the count of evolution Pokémon
      effect.damage = 50 * evolutionPokemonCount;


      return state;
    }

    return state;
  }
}