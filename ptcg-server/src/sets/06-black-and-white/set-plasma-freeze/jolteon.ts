import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Jolteon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  protected _tags = [CardTag.TEAM_PLASMA];
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Pin Missile',
    cost: [C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 4 coins. This attack does 20 damage times the number of heads.'
  }, {
    name: 'Electri-Defuse',
    cost: [L, C],
    damage: 40,
    text: 'If the Defending Pokémon is a Pokémon-EX, that Pokémon can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'PLF';
  public setNumber: string = '34';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jolteon';
  public fullName: string = 'Jolteon PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pin Missile
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 4, (results) => {
        const heads = results.filter((r) => r).length;
        effect.damage = 20 * heads;
      });
    }

    // Electri-Defuse
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const defending = effect.opponent.active.getPokemonCard();
      if (defending && defending.tags.includes(CardTag.POKEMON_EX)) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    return state;
  }
}
