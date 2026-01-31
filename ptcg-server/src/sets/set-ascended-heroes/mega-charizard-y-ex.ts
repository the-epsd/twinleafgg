import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class MegaCharizardYex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Charmeleon';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = R;
  public hp: number = 360;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Plosion Y',
    cost: [R, R, C],
    damage: 0,
    text: 'Discard 3 Energy from this Pokemon. This attack does 280 damage to 1 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Charizard Y ex';
  public fullName: string = 'Mega Charizard Y ex MC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 3);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(280, effect, store, state);
    }
    return state;
  }
}