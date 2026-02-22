import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { StateUtils } from '../../game/store/state-utils';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Farfetchd extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType = C;
  public hp = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Collect',
      cost: [C],
      damage: 0,
      text: 'Draw 2 cards.'
    },
    {
      name: 'Tool Buster',
      cost: [C],
      damage: 20,
      text: 'Before doing damage, discard all Pokémon Tool cards from your opponent\'s Active Pokémon. If you discarded a Pokémon Tool card in this way, this attack does 70 more damage.'
    }
  ];

  public set = 'TEU';
  public setNumber = '127';
  public cardImage = 'assets/cardback.png';
  public name = 'Farfetch\'d';
  public fullName = 'Farfetch\'d TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Collect
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 2);
      return state;
    }
    // Tool Buster
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const activePokemon = opponent.active;
      let toolDiscarded = false;
      if (activePokemon.tools.length > 0) {
        activePokemon.moveCardsTo([...activePokemon.tools], opponent.discard);
        toolDiscarded = true;
      }
      if (toolDiscarded) {
        effect.damage += 70;
      }
      return state;
    }
    return state;
  }
}
