import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Nidoqueen extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Nidorina';
  public cardType: CardType = P;
  public hp: number = 120;
  public weakness = [{ type: P, value: +30 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Maternal Comfort',
    powerType: PowerType.POKEBODY,
    text: 'At any times between turns, remove 1 damage counter from each of your Pokémon. You can\'t use more than 1 Maternal Comfort Poké-Body between turns.'
  }];

  public attacks = [{
    name: 'Mega Punch',
    cost: [P],
    damage: 40,
    text: ''
  },
  {
    name: 'Ruthless Tail',
    cost: [P, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Does 50 damage plus 10 more damage for each of your opponent\'s Benched Pokémon.'
  }];

  public set: string = 'RR';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nidoqueen';
  public fullName: string = 'Nidoqueen RR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Maternal Comfort Poké-Body
    if (effect instanceof BetweenTurnsEffect && !effect.maternalComfortUsed) {
      const player = effect.player;

      let isNidoqueenInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          isNidoqueenInPlay = true;
        }
      });
      if (!isNidoqueenInPlay) { return state; }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.maternalComfortUsed = true;

      player.forEachPokemon(PlayerType.ANY, cardList => {
        const healEffect = new HealEffect(player, cardList, 10);
        state = store.reduceEffect(state, healEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      effect.damage += 10 * opponentBench;
    }

    return state;
  }
} 