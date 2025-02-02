import { AttachEnergyPrompt, ChoosePokemonPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Heatmor extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 110;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Flame Cloak',
      cost: [CardType.FIRE],
      damage: 20,
      text: 'Attach a [R] Energy card from your discard pile to this Pokémon.'
    },
    {
      name: 'Exciting Flame',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: 90,
      text: 'If this Pokémon has at least 3 extra Energy attached (in addition to this attack\'s cost), this attack also does 180 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '41';

  public regulationMark = 'E';

  public name: string = 'Heatmor';

  public fullName: string = 'Heatmor FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.FIRE);
      });

      if (!hasEnergyInDiscard) {
        return state;
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: false, min: 0, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[1]);
      state = store.reduceEffect(state, checkCost);

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Count total FIRE energy provided
      const totalFireEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.filter(type => type === CardType.FIRE).length;
      }, 0);

      // Get number of extra Fire energy  
      const extrafireEnergy = totalFireEnergy - checkCost.cost.length;

      // Apply damage boost based on extra Fire energy
      if (extrafireEnergy >= 3) {
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const targets = selected || [];
          targets.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 180);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
          return state;
        });
      }
    }
    return state;
  }
}