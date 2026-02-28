import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, CONFIRMATION_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class TeamAquasCacturne extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Aqua\'s Cacnea';
  public tags = [CardTag.TEAM_AQUA];
  public cardType: CardType = G;
  public additionalCardTypes = [D];
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Dark Bind',
    cost: [D],
    damage: 10,
    text: 'You may discard a [D] Energy card attached to Team Aqua\'s Cacturne. If you do, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Poison Barb',
    cost: [G, C, C],
    damage: 40,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Team Aqua\'s Cacturne';
  public fullName: string = 'Team Aqua\'s Cacturne MA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.DARK);
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}