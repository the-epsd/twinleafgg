import { PokemonCard, Stage, CardType, PowerType } from '../../game';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Hitmonlee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Stages of Evolution',
    powerType: PowerType.POKEBODY,
    text: 'As long as Hitmonlee is an Evolved Pokémon, Hitmonlee\'s attacks do 20 more damage to your opponent\'s Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Stretch Kick',
    cost: [F],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Benched Pokémon. This attack does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Mega Kick',
    cost: [F, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'UF';
  public name: string = 'Hitmonlee';
  public fullName: string = 'Hitmonlee UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(10, effect, store, state);
    }

    if (effect instanceof PutDamageEffect && effect.source.getPokemonCard() === this) {

      if (IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      if (effect.source.getPokemons().length > 1) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
