import { State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { TERA_RULE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Miraidonex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public cardType: CardType = L;
  public hp: number = 220;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Slashing Claw',
    cost: [L],
    damage: 40,
    text: ''
  },
  {
    name: 'Hadron Spark',
    cost: [L, L, C],
    damage: 120,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is a Pokémon ex, this attack does 120 more damage.'
  }];

  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Miraidon ex';
  public fullName: string = 'Miraidon ex ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
        effect.damage += 20;
      }
    }

    TERA_RULE(effect, state, this);

    return state;
  }
}