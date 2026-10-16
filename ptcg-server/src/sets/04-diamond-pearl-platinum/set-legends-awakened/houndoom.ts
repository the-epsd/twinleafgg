import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../../game/store/prefabs/attack-effects';

export class Houndoom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Houndour';
  public hp: number = 80;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Revenge Fang',
    powerType: PowerType.POKEBODY,
    text: 'If you have less Benched Pokémon than your opponent, each of Houndoom\'s attacks does 40 more damage to the Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Burning Sensation',
    cost: [C],
    damage: 20,
    text: 'If the Defending Pokémon already has any damage counters on it, the Defending Pokémon is now Burned.'
  },
  {
    name: 'Bright Flame',
    cost: [R, R],
    damage: 60,
    text: 'Flip a coin. If tails, discard 2 Fire Energy attached to Houndoom.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Houndoom';
  public fullName: string = 'Houndoom LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Revenge Fang
    if (effect instanceof DealDamageEffect && effect.source.getPokemonCard() === this
      && effect.target === effect.opponent.active) {
      const player = effect.player;
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      const opponent = StateUtils.getOpponent(state, player);
      const playerBench = player.bench.filter(b => b.cards.length > 0).length;
      const opponentBench = opponent.bench.filter(b => b.cards.length > 0).length;
      if (playerBench < opponentBench) {
        effect.damage += 40;
      }
    }

    // Burning Sensation
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.damage > 0) {
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
      }
    }

    // Bright Flame
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, CardType.FIRE);
        }
      });
    }

    return state;
  }
}
