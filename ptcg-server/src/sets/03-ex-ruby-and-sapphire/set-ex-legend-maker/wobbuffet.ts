import { PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PUT_DAMAGE_COUNTERS_ON_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/attack-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Wobbuffet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Stages of Evolution',
    powerType: PowerType.POKEBODY,
    text: 'As long as Wobbuffet is an Evolved Pokémon, your opponent pays [C] more to retreat his or her Active Pokémon.',
  }];

  public attacks = [{
    name: 'Grind',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the amount of Energy attached to Wobbuffet.',
  },
  {
    name: 'Shadow Tag',
    cost: [P, P, C],
    damage: 0,
    text: 'Put 7 damage counters on the Defending Pokémon at the end of your opponent\'s next turn.',
  }];

  public set: string = 'LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Wobbuffet';
  public fullName: string = 'Wobbuffet LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Stages of Evolution
    if (effect instanceof CheckRetreatCostEffect) {
      const retreatingPlayer = effect.player;
      const abilityOwner = StateUtils.getOpponent(state, retreatingPlayer);

      let isEvolvedWobbuffetInPlay = false;
      abilityOwner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.getPokemons().length > 1) {
          isEvolvedWobbuffetInPlay = true;
        }
      });

      if (!isEvolvedWobbuffetInPlay) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        retreatingPlayer.active,
      )) {
        return state;
      }

      effect.cost.push(CardType.COLORLESS);
    }

    // Grind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
          store.reduceEffect(state, checkProvidedEnergy);

          const energyCount = checkProvidedEnergy.energyMap.reduce(
            (sum, em) => sum + em.provides.length,
            0,
          );
          effect.damage = energyCount * 10;
        }
      });
    }

    // Shadow Tag
    if (WAS_ATTACK_USED(effect, 1, this)) {
      PUT_DAMAGE_COUNTERS_ON_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN(store, state, effect, this, 70);
    }

    return state;
  }
}
