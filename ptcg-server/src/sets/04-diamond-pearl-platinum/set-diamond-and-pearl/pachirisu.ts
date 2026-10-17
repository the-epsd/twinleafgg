import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, SEARCH_DECK_FOR_CARDS_TO_HAND, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pachirisu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: 20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Minor Errand-Running',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a basic Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Thunder Jolt',
    cost: [L],
    damage: 20,
    text: 'Flip a coin. If tails, Pachirisu does 10 damage to itself.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Pachirisu';
  public fullName: string = 'Pachirisu DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Minor Errand-Running
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, { superType: SuperType.ENERGY, energyType: EnergyType.BASIC }, { min: 0, max: 1, allowCancel: false });
    }

    // Thunder Jolt
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (!result) {
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
        }
      });
    }

    return state;
  }
}
