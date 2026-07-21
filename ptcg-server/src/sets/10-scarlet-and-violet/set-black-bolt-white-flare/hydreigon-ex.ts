import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_RETREAT, IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Hydreigonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Zweilous';
  public tags = [CardTag.POKEMON_ex];
  public cardType = D;
  public hp: number = 330;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Greedy Eater',
    powerType: PowerType.ABILITY,
    text: 'If your opponent\'s Basic Pokémon is Knocked Out by damage from an attack this Pokémon uses, take 1 more Prize card.'
  }];

  public attacks = [{
    name: 'Dark Bite',
    cost: [D, D, D, C, C],
    damage: 200,
    text: 'During your opponent\'s next turn, that Pokémon can\'t retreat.'
  }];

  public set: string = 'WHT';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Hydreigon ex';
  public fullName: string = 'Hydreigon ex SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES(store, state, effect, this, {
      checkAbilityBlocked: true,
      validate: (store, state, koEffect) => koEffect.target.isStage(Stage.BASIC),
    });
  }
}
