import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PlayerType, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EvolveEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { IS_POKEMON_POWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Omanyte extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Mysterious Fossil';
  public hp: number = 40;
  public cardType: CardType = W;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Clairvoyance',
    powerType: PowerType.POKEMON_POWER,
    text: 'Your opponent plays with his or her hand face up. This power stops working while Omanyte is Asleep, Confused, or Paralyzed.',
  }];

  public attacks = [{
    name: 'Water Gun',
    cost: [W],
    damage: 10,
    damageCalculation: '+',
    text: 'Does 10 damage plus 10 more damage for each Water Energy attached to Omanyte but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Omanyte';
  public fullName: string = 'Omanyte FO';

  private isThisInPlay(state: State): boolean {
    try {
      const cardList = StateUtils.findCardList(state, this);
      return cardList instanceof PokemonCardList
        && cardList.cards.includes(this)
        && cardList.getPokemonCard() === this;
    } catch {
      return false;
    }
  }

  private syncClairvoyanceHands(store: StoreLike, state: State): void {
    const revealHandIds = new Set<number>();

    for (const player of state.players) {
      let hasClairvoyance = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (!card.powers.some(power => power.name === 'Clairvoyance')) {
          return;
        }

        if (
          cardList.specialConditions.includes(SpecialCondition.ASLEEP) ||
          cardList.specialConditions.includes(SpecialCondition.CONFUSED) ||
          cardList.specialConditions.includes(SpecialCondition.PARALYZED)
        ) {
          return;
        }

        if (IS_POKEMON_POWER_BLOCKED(store, state, player, card)) {
          return;
        }

        hasClairvoyance = true;
      });

      if (hasClairvoyance) {
        revealHandIds.add(StateUtils.getOpponent(state, player).id);
      }
    }

    for (const player of state.players) {
      player.hand.isPublic = revealHandIds.has(player.id);
    }
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Play/evolve runs before the card is on the board, so reveal immediately
    // (and skip the board sync below, which would clear it too early).
    if ((effect instanceof PlayPokemonEffect || effect instanceof EvolveEffect) && effect.pokemonCard === this && !IS_POKEMON_POWER_BLOCKED(store, state, effect.player, this)) {
      StateUtils.getOpponent(state, effect.player).hand.isPublic = true;
    } else if (!(effect instanceof PowerEffect)) {
      // Keep opponent hand publicity in sync while Clairvoyance is (or was) active.
      // Skip PowerEffect stubs to avoid recursion from IS_POKEMON_POWER_BLOCKED.
      const anyHandPublic = state.players.some(player => player.hand.isPublic);
      if (this.isThisInPlay(state) || anyHandPublic) {
        this.syncClairvoyanceHands(store, state);
      }
    }

    // Water Gun
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);

      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      const waterEnergy = checkEnergy.energyMap.filter(e =>
        e.provides.includes(CardType.WATER));

      const extraWaterEnergy = Math.min(waterEnergy.length - checkCost.cost.length, 2);
      if (extraWaterEnergy > 0) {
        effect.damage += extraWaterEnergy * 10;
      }
    }

    return state;
  }
}
