import { PokemonCard, Stage, CardType, State, StoreLike, PowerType, StateUtils } from '../../game';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EnergyType } from '../../game/store/card/card-types';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class Carracosta extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Tirtouga';
  public cardType: CardType = W;
  public hp: number = 180;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Mighty Shell',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage and effects done to this Pokémon by attacks from your opponent\'s Pokemon that have any Special Energy attached to them.'
  }];

  public attacks = [{
    name: 'Bite Down',
    cost: [W, C, C],
    damage: 0,
    text: 'The Defending Pokemon can\'t retreat during your opponent\'s next turn.'
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public setNumber: string = '23';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Carracosta';
  public fullName: string = 'Carracosta SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (sourceCard) {
        // Only block if the attacking Pokémon has any Special Energy attached
        const specialEnergyAttached = effect.source.energies.cards.some(card => card.energyType === EnergyType.SPECIAL);
        if (!specialEnergyAttached) {
          return state;
        }

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const player = StateUtils.findOwner(state, effect.target);
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }
        effect.preventDefault = true;
      }
      return state;
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    return state;
  }
}