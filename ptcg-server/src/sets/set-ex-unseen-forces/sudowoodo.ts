import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, GameMessage,
  ChooseAttackPrompt,
  EnergyMap,
  Player
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Sudowoodo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Copy',
    cost: [C],
    damage: 0,
    text: 'Choose 1 of the Defending Pokémon\'s attacks.Copy copies that attack.This attack does nothing if Sudowoodo doesn\'t have the Energy necessary to use that attack. (You must still do anything else required for that attack.) Sudowoodo performs that attack.'
  },
  {
    name: 'Karate Chop',
    cost: [F, C, C],
    damage: 50,
    damageCalculation: '-',
    text: 'Does 50 damage minus 10 damage for each damage counter on Sudowoodo.'
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Sudowoodo';
  public fullName: string = 'Sudowoodo UF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Copy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Build cards and blocked for Choose Attack prompt
      const { pokemonCards, blocked } = this.buildAttackList(state, store, player);

      // No attacks to copy
      if (pokemonCards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_COPY,
        pokemonCards,
        { allowCancel: true, blocked }
      ), attack => {
        if (attack !== null) {
          const attackEffect = new AttackEffect(player, opponent, attack);
          store.reduceEffect(state, attackEffect);

          if (attackEffect.damage > 0) {
            const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
            state = store.reduceEffect(state, dealDamage);
          }
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage = Math.max(50 - effect.source.damage, 0);
    }

    return state;
  }

  private buildAttackList(
    state: State, store: StoreLike, player: Player
  ): { pokemonCards: PokemonCard[], blocked: { index: number, attack: string }[] } {
    const opponent = StateUtils.getOpponent(state, player);
    const opponentActive = opponent.active.getPokemonCard();

    const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
    store.reduceEffect(state, checkProvidedEnergyEffect);
    const energyMap = checkProvidedEnergyEffect.energyMap;

    const pokemonCards: PokemonCard[] = [];
    const blocked: { index: number, attack: string }[] = [];
    if (opponentActive) {
      this.checkAttack(state, store, player, opponentActive, energyMap, pokemonCards, blocked);
    }

    return { pokemonCards, blocked };
  }

  private checkAttack(state: State, store: StoreLike, player: Player,
    card: PokemonCard, energyMap: EnergyMap[], pokemonCards: PokemonCard[],
    blocked: { index: number, attack: string }[]
  ) {
    {

      const attacks = card.attacks.filter(attack => {
        const checkAttackCost = new CheckAttackCostEffect(player, attack);
        state = store.reduceEffect(state, checkAttackCost);
        return StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost as CardType[]);
      });
      const index = pokemonCards.length;
      pokemonCards.push(card);
      card.attacks.forEach(attack => {
        if (!attacks.includes(attack)) {
          blocked.push({ index, attack: attack.name });
        }
      });
    }
  }
}