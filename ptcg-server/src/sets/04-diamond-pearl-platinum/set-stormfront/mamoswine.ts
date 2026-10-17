import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CONFIRMATION_PROMPT, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mamoswine extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Piloswine';
  public hp: number = 140;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +30 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C, C, C];

  public attacks = [{
    name: 'Ramming Strike',
    cost: [F, C, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads or you may start again. Each time you start again, put 2 damage counters on Mamoswine. (If Mamoswine would be Knocked Out, you can\'t start again.)'
  },
  {
    name: 'Parade',
    cost: [W, F, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'Does 60 damage plus 10 more damage for each Swinub on your Bench, plus 20 more damage for each Piloswine on your Bench, and 40 more damage for each Mamoswine on your Bench.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Mamoswine';
  public fullName: string = 'Mamoswine SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ramming Strike
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const source = effect.source;
      const pokemonCard = source.getPokemonCard();
      if (!pokemonCard) {
        return state;
      }

      const runFlipSequence = (): void => {
        FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
          CONFIRMATION_PROMPT(store, state, player, wantToRestart => {
            if (!wantToRestart) {
              effect.damage = 30 * heads;
              return;
            }

            const damageAfterCounters = source.damage + 20;
            if (damageAfterCounters >= pokemonCard.hp) {
              effect.damage = 30 * heads;
              return;
            }

            const counterEffect = new PutDamageEffect(effect, 20);
            counterEffect.target = source;
            store.reduceEffect(state, counterEffect);
            runFlipSequence();
          }, GameMessage.WANT_TO_USE_ABILITY);
        });
      };

      runFlipSequence();
    }

    // Parade
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let bonus = 0;

      player.bench.forEach(bench => {
        const card = bench.getPokemonCard();
        if (!card) {
          return;
        }
        if (card.name === 'Swinub') {
          bonus += 10;
        } else if (card.name === 'Piloswine') {
          bonus += 20;
        } else if (card.name === 'Mamoswine') {
          bonus += 40;
        }
      });

      effect.damage = 60 + bonus;
    }

    return state;
  }
}
