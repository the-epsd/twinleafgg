import { State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamAquasCacnea extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_AQUA];
  public cardType: CardType = G;
  public additionalCardTypes = [D];
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Paralyzing Gaze',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Pin Missile',
    cost: [C, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 4 coins. This attack does 10 damage times the number of heads.'
  }];

  public set: string = 'MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Team Aqua\'s Cacnea';
  public fullName: string = 'Team Aqua\'s Cacnea MA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      })
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 4, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage = 10 * heads;
      });
    }

    return state;
  }
}