import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Jynx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Icy Kiss',
    cost: [W, C],
    damage: 30,
    text: 'If Jynx was damaged by an attack during your opponent\'s last turn, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Lovely Kiss',
    cost: [P, C],
    damage: 0,
    text: 'Move 2 damage counters from Jynx to the Defending Pokémon. If Smoochum is anywhere under Jynx, move 4 damage counters instead.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Jynx';
  public fullName: string = 'Jynx SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Icy Kiss
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if ((this.damageTakenLastTurn ?? 0) > 0) {
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
      }
    }

    // Lovely Kiss
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const hasSmoochum = player.active.getPokemons().some(p => p.name === 'Smoochum');
      const counters = hasSmoochum ? 4 : 2;
      const damageToMove = Math.min(player.active.damage, counters * 10);
      if (damageToMove > 0) {
        player.active.damage -= damageToMove;
        const putCounters = new PutCountersEffect(effect, damageToMove);
        putCounters.target = effect.opponent.active;
        store.reduceEffect(state, putCounters);
      }
    }

    return state;
  }
}
