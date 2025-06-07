import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, BLOCK_EFFECT_IF_MARKER, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_AT_END_OF_TURN, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, REPLACE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';
import { PlayerType, StateUtils } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { HealEffect } from '../../game/store/effects/game-effects';

export class Sceptileex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Grovyle';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = G;
  public hp: number = 150;
  public weakness = [{ type: G }, { type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Green Heal',
    cost: [G],
    damage: 0,
    text: 'Remove 4 damage counters from each of your Pokémon that has [G] Energy attached. If that Pokémon has less than 4 damage counters, remove all of them.'
  },
  {
    name: 'Poison Ring',
    cost: [G, C, C],
    damage: 40,
    text: 'The Defending Pokémon is now Poisoned. The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
  },
  {
    name: 'Slashing Strike',
    cost: [G, G, C, C, C],
    damage: 100,
    text: 'Sceptile ex can\'t use Slashing Strike during your next turn.'
  }];

  public set: string = 'MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Sceptile ex';
  public fullName: string = 'Sceptile ex MA';

  public readonly POISON_RING_MARKER: string = 'POISON_RING_MARKER';
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);

        const energyMap = checkProvidedEnergyEffect.energyMap;
        const hasGrassEnergy = StateUtils.checkEnoughEnergy(energyMap, [CardType.GRASS]);

        if (hasGrassEnergy) {
          const healEffect = new HealEffect(player, cardList, 40);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
      ADD_MARKER(this.POISON_RING_MARKER, opponent.active, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, this.POISON_RING_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.POISON_RING_MARKER, this);

    if (WAS_ATTACK_USED(effect, 2, this)) {
      BLOCK_EFFECT_IF_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);
      ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
    REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
    return state;
  }
}