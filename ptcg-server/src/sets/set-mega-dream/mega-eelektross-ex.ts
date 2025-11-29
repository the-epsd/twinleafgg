import { CardTag, CardType, DiscardEnergyPrompt, EnergyCard, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike, SuperType, SpecialCondition } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaEelektrossex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Eelektrik';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = L;
  public hp: number = 350;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Split Bomb',
    cost: [L, L],
    damage: 0,
    text: 'This attack does 60 damage to 2 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
  },
  {
    name: 'Disaster Shock',
    cost: [L, L, L],
    damage: 190,
    text: 'You may discard 2 [L] Energy from this Pokemon. If you do, your opponent\'s Active Pokemon is now Paralyzed.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'M2a';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Eelektross ex';
  public fullName: string = 'Mega Eelektross ex M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      // Split Bomb: 60 damage to 2 opponent's Pokemon
      // Don't apply Weakness and Resistance for Benched Pokemon
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(60, effect, store, state, 2, 2, false, [SlotType.ACTIVE, SlotType.BENCH]);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      // Disaster Shock: 190 damage, optionally discard 2 [L] Energy to Paralyze
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check how many Lightning energy cards are attached to this Pokemon
      const lightningEnergyCount = player.active.cards.filter(card =>
        card instanceof EnergyCard && card.provides.includes(CardType.LIGHTNING)
      ).length;

      // If player has at least 2 Lightning energy, offer to discard
      if (lightningEnergyCount >= 2) {
        return store.prompt(state, new DiscardEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE], // Only from active Pokemon (this Pokemon)
          { superType: SuperType.ENERGY },
          { min: 0, max: 2, allowCancel: false }
        ), transfers => {
          if (transfers === null || transfers.length === 0) {
            // Player chose not to discard, just do damage
            return state;
          }

          // Validate that all selected energy provides Lightning energy
          const validLightningEnergy = transfers.filter(transfer => {
            const energyCard = transfer.card;
            return energyCard instanceof EnergyCard && energyCard.provides.includes(CardType.LIGHTNING);
          });

          // Only proceed if exactly 2 Lightning energy were selected
          if (validLightningEnergy.length === 2) {
            // Discard the selected energy cards
            for (const transfer of validLightningEnergy) {
              const source = StateUtils.getTarget(state, player, transfer.from);
              source.moveCardTo(transfer.card, player.discard);
            }

            // Apply Paralyzed status to opponent's Active Pokemon
            const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
            specialConditionEffect.target = opponent.active;
            store.reduceEffect(state, specialConditionEffect);
          }
          // If player selected less than 2 or non-Lightning energy, nothing happens (no discard, no paralysis)
        });
      }
    }

    return state;
  }
}

