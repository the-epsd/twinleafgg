import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { EnergyCard, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';

export class Drapion extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Skorupi';
  public hp: number = 110;
  public cardType: CardType[] = [D];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Scorpion Grapple',
    cost: [],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed. If tails, the Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  },
  {
    name: 'Cross Poison',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 4 coins. This attack does 20 damage times the number of heads. If 2 or more of them are heads, the Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Derail',
    cost: [D, D, C],
    damage: 60,
    text: 'Discard all Special Energy cards attached to the Defending Pokémon.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Drapion';
  public fullName: string = 'Drapion SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scorpion Grapple
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        } else {
          BLOCK_RETREAT(store, state, effect, this);
        }
      });
    }

    // Cross Poison
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 4, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 20 * heads;
        if (heads >= 2) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    // Derail
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const opponent = effect.opponent;
      const pokemons = opponent.active.getPokemons();
      opponent.active.cards
        .filter(c => !pokemons.includes(c as PokemonCard)
          && c instanceof EnergyCard
          && c.energyType === EnergyType.SPECIAL)
        .forEach(c => { opponent.active.moveCardTo(c, opponent.discard); });
    }

    return state;
  }
}
