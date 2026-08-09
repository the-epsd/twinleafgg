import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Sigilyph extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Reflective Shield',
    cost: [C],
    damage: 0,
    text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if this Pokémon is Knocked Out), put 5 damage counters on the Attacking Pokémon.'
  },
  {
    name: 'Psy Report',
    cost: [P, P],
    damage: 30,
    text: 'Your opponent reveals his or her hand.'
  }];

  public set: string = 'BKP';
  public setNumber: string = '55';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sigilyph';
  public fullName: string = 'Sigilyph BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this, { damage: 50 });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);
    }

    return state;
  }
}
