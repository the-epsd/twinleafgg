import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';

export class Vanilluxe extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Vanillish';
  public cardType: CardType[] = [W];
  public hp: number = 130;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Frigid Breath',
    cost: [W, C],
    damage: 30,
    text: 'Until the end of your next turn, each player can\'t play any Supporter or Stadium cards from his or her hand.'
  }, {
    name: 'Deep Freeze',
    cost: [W, C, C],
    damage: 70,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed. If tails, your opponent\'s Active Pokémon is now Confused.'
  }];

  public set: string = 'BKT';
  public setNumber: string = '45';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vanilluxe';
  public fullName: string = 'Vanilluxe BKT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Frigid Breath
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { supporter: true, stadium: true, bothPlayers: true });
    }

    // Deep Freeze
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        } else {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        }
      });
    }
    return state;
  }
}
