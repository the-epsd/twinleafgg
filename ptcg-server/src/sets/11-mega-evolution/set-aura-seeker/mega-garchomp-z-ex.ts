import { CardTag, CardType, PokemonCard, pokemonHasCardType, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE, THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class MegaGarchompZex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Gabite';
  protected _tags = [CardTag.POKEMON_ex, CardTag.POKEMON_SV_MEGA];
  public hp: number = 360;
  public cardType: CardType[] = [N];
  public weakness = [];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Dragon Avenger',
    cost: [W, F],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each [N] Pokémon in your discard pile.'
  },
  {
    name: 'Sonic Edge',
    cost: [W, F, C],
    damage: 240,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Mega Garchomp Z ex';
  public fullName: string = 'Mega Garchomp Z ex FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dragon Avenger
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE(
        30,
        c => pokemonHasCardType(c, CardType.DRAGON),
        effect
      );
    }

    // Sonic Edge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 240);
    }

    return state;
  }
}
