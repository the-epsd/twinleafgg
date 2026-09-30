import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../../game/store/card/card-types';
import { StoreLike, State, Card } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { COPY_ATTACK_FROM_POKEMON_LIST } from '../../../game/store/prefabs/copy-attack-prefabs';

export class Empoleon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Prinplup';
  public cardType: CardType[] = [W];
  public hp: number = 160;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Recall',
    cost: [C],
    damage: 0,
    copycatAttack: true,
    text: 'Choose an attack from 1 of this Pokémon\'s previous Evolutions and use it as this attack.'
  },
  {
    name: 'Aquafall',
    cost: [C, C],
    damage: 130,
    text: 'Discard all Energy from this Pokémon.'
  }];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Empoleon';
  public fullName: string = 'Empoleon CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const evolutionCards: Card[] = [];
      for (const card of player.active.cards) {
        if (card.superType === SuperType.POKEMON && card !== this) {
          evolutionCards.push(card);
        }
      }

      if (evolutionCards.length === 0 || !evolutionCards.some(c => c.attacks && c.attacks.length > 0)) {
        return state;
      }

      return COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect as AttackEffect, evolutionCards);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
    }

    return state;
  }
}
