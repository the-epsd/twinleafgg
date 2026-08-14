import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike } from '../../../game';

export class Regice extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Ice Beam',
    cost: [W, C],
    damage: 30,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }, {
    name: 'Resistance Blizzard',
    cost: [W, C, C],
    damage: 70,
    text: 'During your opponent\'s next turn, prevent all effects of attacks, including damage, done to this Pokémon by Pokémon-EX.'
  }];

  public set: string = 'AOR';
  public setNumber: string = '24';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Regice';
  public fullName: string = 'Regice AOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ice Beam
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    // Resistance Blizzard
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const options = { sourceTags: [CardTag.POKEMON_EX] };
      PREVENT_DAMAGE(store, state, effect, this, options);
      PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this, options);
    }

    return state;
  }
}
