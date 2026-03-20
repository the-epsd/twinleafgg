import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, GameMessage, SlotType, PlayerType, StateUtils, ChooseCardsPrompt, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, COIN_FLIP_PROMPT, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Swampertex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Marshtomp';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 150;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Hyper Pump',
    cost: [C],
    damage: 20,
    damageCalculation: '+',
    text: 'Does 20 damage plus 20 more damage for each basic Energy attached to Swampert ex but not used to pay for this attack\'s Energy cost. You can\'t add more than 80 damage in this way.'
  },
  {
    name: 'Crushing Wave',
    cost: [W, C, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 40 damage to that Pokémon. After doing damage, flip a coin. If heads, your opponent discards an Energy card, if any, attached to that Pokémon. (Don\'t apply Weakness and Resistance to Benched Pokémon.)'
  }];

  public set: string = 'MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name: string = 'Swampert ex';
  public fullName: string = 'Swampert ex MA';

  private crushingWaveTarget: PokemonCardList | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Hyper Pump counts basic Energy not used to pay this attack's [C] cost.
      const basicEnergyProvided = checkEnergy.energyMap
        .filter(e => e.card.superType === SuperType.ENERGY && e.card.energyType === EnergyType.BASIC)
        .reduce((total, energy) => total + energy.provides.length, 0);

      const nonBasicEnergyProvided = checkEnergy.energyMap
        .filter(e => e.card.superType !== SuperType.ENERGY || e.card.energyType !== EnergyType.BASIC)
        .reduce((total, energy) => total + energy.provides.length, 0);

      const basicEnergyNeededForCost = Math.max(0, checkCost.cost.length - nonBasicEnergyProvided);
      const extraBasicEnergy = Math.max(0, basicEnergyProvided - basicEnergyNeededForCost);

      effect.damage += Math.min(extraBasicEnergy, 4) * 20;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      this.crushingWaveTarget = undefined;

      const targets = opponent.getPokemonInPlay();
      if (targets.length === 0)
        return state;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
      ), selected => {
        const targets = selected || [];
        if (targets.length === 0) {
          return;
        }

        const target = targets[0];
        this.crushingWaveTarget = target;
        effect.target = target;

        let damageEffect: DealDamageEffect | PutDamageEffect;
        if (target === opponent.active) {
          damageEffect = new DealDamageEffect(effect, 40);
        } else {
          damageEffect = new PutDamageEffect(effect, 40);
        }
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const target = this.crushingWaveTarget;
      if (target === undefined) {
        return state;
      }

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const energyCards = target.cards.filter(c => c.superType === SuperType.ENERGY);
          if (energyCards.length === 0) {
            return state;
          }

          return store.prompt(state, new ChooseCardsPrompt(
            opponent,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            target,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            const cards = selected || [];
            if (cards.length > 0) {
              MOVE_CARDS(store, state, target, opponent.discard, { cards: cards });
            }
          });
        }
      });

      this.crushingWaveTarget = undefined;
    }

    return state;
  }
}
