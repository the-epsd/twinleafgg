import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class Umbreon2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Confuse Ray',
      cost: [C],
      damage: 20,
      text: 'The Defending Pokémon is now Confused.'
    },
    {
      name: 'Shadow Shutdown',
      cost: [D, C, C],
      damage: 60,
      text: 'Flip 2 coins. If both of them are heads, discard all Energy attached to the Defending Pokémon.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Umbreon';
  public fullName: string = 'Umbreon DEX 61';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Confuse Ray
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    // Shadow Shutdown - flip 2 coins, both heads = discard all energy
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const allHeads = results.every(r => r);
        if (allHeads) {
          // Discard all energy from defending Pokemon
          const energyCards = opponent.active.cards.filter(c =>
            c.superType === SuperType.ENERGY
          );
          energyCards.forEach(card => {
            opponent.active.moveCardTo(card, opponent.discard);
          });
        }
      });
    }

    return state;
  }
}
