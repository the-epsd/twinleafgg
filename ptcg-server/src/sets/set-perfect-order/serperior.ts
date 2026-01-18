import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Serperior extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Servine';
  public cardType: CardType = G;
  public hp: number = 160;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Royal Command',
    cost: [G],
    damage: 0,
    damageCalculation: 'x',
    text: 'This attack does 20 damage for each Pokemon you have in play.'
  },
  {
    name: 'Solar Winder',
    cost: [G, G, G],
    damage: 100,
    damageCalculation: '+',
    text: 'If you have Rosa\'s Encouragement in your discard pile, this attack does 150 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Serperior';
  public fullName: string = 'Serperior M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Royal Command - 20x damage per Pokemon in play
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let pokemonCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, () => {
        pokemonCount++;
      });

      effect.damage = pokemonCount * 20;
    }

    // Solar Winder - +150 damage if Rosa's Encouragement in discard
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const hasRosasEncouragement = player.discard.cards.some(card => card.name === 'Rosa\'s Encouragement');

      if (hasRosasEncouragement) {
        effect.damage += 150;
      }
    }

    return state;
  }
}
