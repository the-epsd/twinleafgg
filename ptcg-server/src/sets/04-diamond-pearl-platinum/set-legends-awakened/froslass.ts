import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GamePhase, PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class Froslass extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snorunt';
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: M, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Destiny Bond',
    cost: [P],
    damage: 0,
    text: 'Discard a Psychic Energy attached to Froslass. During your opponent\'s next turn, if Froslass would be Knocked Out by damage from an attack, the Attacking Pokémon is Knocked Out.'
  },
  {
    name: 'Icy Breath',
    cost: [W, C],
    damage: 40,
    text: 'The Defending Pokémon is now Asleep. Put 1 damage counter on each of your opponent\'s Benched Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Froslass';
  public fullName: string = 'Froslass LA';

  public readonly DESTINY_BOND_MARKER = 'DESTINY_BOND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect) {
      for (const player of state.players) {
        if (!HAS_MARKER(this.DESTINY_BOND_MARKER, player, this)) {
          continue;
        }
        const opponent = StateUtils.getOpponent(state, player);
        if (effect.player === opponent) {
          REMOVE_MARKER(this.DESTINY_BOND_MARKER, player, this);
        }
      }
    }

    // Destiny Bond
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.PSYCHIC);
      ADD_MARKER(this.DESTINY_BOND_MARKER, effect.player, this);
    }

    if (effect instanceof KnockOutEffect && effect.target.getPokemonCard() === this
      && HAS_MARKER(this.DESTINY_BOND_MARKER, effect.player, this)
      && state.phase === GamePhase.ATTACK
      && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const attacker = StateUtils.getOpponent(state, effect.player);
      attacker.active.damage += 999;
    }

    // Icy Breath
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
      const opponent = StateUtils.getOpponent(state, player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList !== opponent.active) {
          const countersEffect = new PutCountersEffect(effect, 10);
          countersEffect.target = cardList;
          store.reduceEffect(state, countersEffect);
        }
      });
    }

    return state;
  }
}
