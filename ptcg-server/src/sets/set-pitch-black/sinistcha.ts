import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { countGhostVeilPokemonInDiscard, reduceGhostVeil } from './ghost-veil';

export class Sinistcha extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Poltchageist';
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Ghost Veil',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon can\'t be affected by effects of attacks or Abilities from your opponent\'s Pokémon.',
  }];

  public attacks = [{
    name: 'Matcha Spin',
    cost: [C],
    damage: 0,
    text: 'If you have 6 or more Pokémon in your discard with the Ghost Veil Ability, place 4 damage counters on each of your opponent\'s Pokémon.',
  }];

  public set: string = 'M5';
  public setNumber: string = '6';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sinistcha';
  public fullName: string = 'Sinistcha M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    reduceGhostVeil(store, state, effect, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      effect.damage = 0;

      if (countGhostVeilPokemonInDiscard(player) < 6) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        if (cardList.cards.length === 0) {
          return;
        }
        const counters = new PlaceDamageCountersEffect(player, cardList, 40, this);
        store.reduceEffect(state, counters);
      });
    }

    return state;
  }
}
