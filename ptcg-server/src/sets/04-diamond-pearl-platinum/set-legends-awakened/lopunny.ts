import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../../game/store/effects/game-phase-effects';
import { DRAW_CARDS, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Lopunny extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Buneary';
  public hp: number = 80;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Healing Tail',
    powerType: PowerType.POKEBODY,
    text: 'As long as Lopunny is your Active Pokémon, remove 1 damage counter from each of your Benched Pokémon between turns.'
  }];

  public attacks = [{
    name: 'Collect',
    cost: [],
    damage: 0,
    text: 'Draw 3 cards.'
  },
  {
    name: 'Cross-Cut',
    cost: [C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is an Evolved Pokémon, this attack does 30 damage plus 30 more damage.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Lopunny';
  public fullName: string = 'Lopunny LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Healing Tail
    if (effect instanceof BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      player.bench.forEach(bench => {
        if (bench.cards.length > 0 && bench.damage > 0) {
          const healEffect = new HealEffect(player, bench, 10);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    // Collect
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 3);
    }

    // Cross-Cut
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.getPokemons().length > 1) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
