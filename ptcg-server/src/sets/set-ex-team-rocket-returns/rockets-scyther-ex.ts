import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType, PowerType, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, AFTER_ATTACK, BLOCK_EFFECT_IF_MARKER, CONFIRMATION_PROMPT, IS_POKEBODY_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, REPLACE_MARKER_AT_END_OF_TURN, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class RocketsScytherex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.ROCKETS];
  public cardType: CardType = D;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Dual Armor',
    powerType: PowerType.POKEBODY,
    text: 'As long as Rocket\'s Scyther ex has any [G] Energy attached to it, Rocket\'s Scyther ex is both [G] and [D] type.'
  }];

  public attacks = [{
    name: 'Bounce',
    cost: [C],
    damage: 10,
    text: 'After your attack, you may switch Rocket\'s Scyther ex with 1 of your Benched Pokémon.'
  },
  {
    name: 'Slashing Strike',
    cost: [C, C, C],
    damage: 40,
    text: 'Rocket\'s Scyther ex can\'t use Slashing Strike during your next turn.'
  }];

  public set: string = 'TRR';
  public name: string = 'Rocket\'s Scyther ex';
  public fullName: string = 'Rocket\'s Scyther ex TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Dual Armor
    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this && !IS_POKEBODY_BLOCKED(store, state, StateUtils.findOwner(state, effect.target), this)) {
      const player = StateUtils.findOwner(state, effect.target);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
          store.reduceEffect(state, checkProvidedEnergyEffect);

          const energyMap = checkProvidedEnergyEffect.energyMap;
          const hasGrassEnergy = StateUtils.checkEnoughEnergy(energyMap, [CardType.GRASS]);

          if (hasGrassEnergy) {
            effect.cardTypes = [G, D];
          }
        }
      });
    }

    // Slashing Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      BLOCK_EFFECT_IF_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);
      ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
    REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);

    if (AFTER_ATTACK(effect, 0, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
        }
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    return state;
  }

}
