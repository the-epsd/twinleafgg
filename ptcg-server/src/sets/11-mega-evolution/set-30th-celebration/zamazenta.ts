import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Zamazenta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Knock Off',
    cost: [M],
    damage: 20,
    text: 'Before doing damage, discard a Pokémon Tool attached to your opponent\'s Active Pokémon.'
  },
  {
    name: 'Shield Press',
    cost: [M, M, C],
    damage: 100,
    text: 'During your opponent\'s next turn, this Pokémon takes 50 less damage from attacks.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Zamazenta';
  public fullName: string = 'Zamazenta 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Knock Off
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const activePokemon = opponent.active;
      if (activePokemon.tools.length > 0) {
        MOVE_CARDS(store, state, activePokemon, opponent.discard, {
          cards: [...activePokemon.tools],
        });
      }
    }

    // Shield Press
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 50;
    }

    return state;
  }
}
