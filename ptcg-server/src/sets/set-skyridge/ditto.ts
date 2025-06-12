import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, GameMessage,
  ChooseAttackPrompt,
  EnergyMap,
  Player,
  PowerType,
  EnergyCard
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Ditto extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Prismatic Body',
    powerType: PowerType.POKEBODY,
    text: 'Each basic Energy card attached to Ditto provides every type of Energy but provides only 1 Energy at a time.'
  }];

  public attacks = [{
    name: 'Copy',
    cost: [C],
    damage: 0,
    text: 'Choose 1 of the Defending Pokémon\'s attacks. Copy copies that attack. This attack does nothing if Ditto doesn\'t have the Energy necessary to use that attack. (You must still do anything else required in order to use that attack.)'
  }];

  public set: string = 'SK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Ditto';
  public fullName: string = 'Ditto SK';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Prismatic Body
    if (effect instanceof CheckProvidedEnergyEffect) {
      const player = effect.player;

      if (!IS_POKEBODY_BLOCKED(store, state, player, this)) {

        effect.source.cards.forEach(c => {
          if (c instanceof EnergyCard &&
            c.energyType === EnergyType.BASIC &&
            effect.source.cards.includes(this) &&
            !effect.energyMap.some(e => e.card === c)) {
            effect.energyMap.push({ card: c, provides: [CardType.ANY] });
          }
        });
        return state;
      }
      return state;
    }

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