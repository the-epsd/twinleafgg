import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
export class SeasManaphy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Hypnosplash',
    cost: [W],
    damage: 10,
    text: 'The Defending Pokémon is now Asleep.'
  },
  {
    name: 'Miraculous Light',
    cost: [W, C],
    damage: 20,
    text: 'Remove 1 damage counter and all Special Conditions from Sea\'s Manaphy.'
  }];

  public set: string = 'PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '139';
  public name: string = 'Sea\'s Manaphy';
  public fullName: string = 'Sea\'s Manaphy PCGP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 10);
      const conditions = effect.target.specialConditions.slice();
      conditions.forEach((condition: any) => {
        effect.target.removeSpecialCondition(condition);
      });
    }

    return state;
  }
}

