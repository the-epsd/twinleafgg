import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Tropius extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: 20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Bonus Leaf',
    cost: [G],
    damage: 0,
    text: 'Remove 3 damage counters from each of your Benched Pokémon that has any Grass Energy attached to it.'
  },
{
    name: 'Whirlwind',
    cost: [G, C],
    damage: 30,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Tropius';
  public fullName: string = 'Tropius MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bonus Leaf
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (card) => {
      if (card !== player.active) {
      card.damage -= 30;
      }
      });
    }

    // Whirlwind
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
    }

    return state;
  }
}
