import { PokemonCard, Stage, PowerType, StoreLike, State, Card, GameMessage, DiscardEnergyPrompt, EnergyType, PlayerType, SlotType, SuperType, CardTag } from '../../game';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class EthansMagcargo extends PokemonCard {

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Ethan\'s Slugma';

  public tags = [CardTag.ETHANS];

  public cardType = R;

  public hp = 130;

  public weakness = [{ type: W }];

  public retreat = [C, C, C];

  public powers = [{
    name: 'Melt and Flow',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has no Energy attached, it has no Retreat Cost.'
  }];

  public attacks = [{
    name: 'Lava Burst',
    cost: [R, R, R],
    damage: 70,
    damageCalculation: 'x',
    text: 'Discard up to 5 [R] Energy from this Pokémon. This attack does 70 damage for each card you discarded in this way.'
  }];

  public regulationMark = 'I';

  public set: string = 'SV9a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '19';

  public name: string = 'Ethan\'s Magcargo';

  public fullName: string = 'Ethan\'s Magcargo SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;

      if (!IS_ABILITY_BLOCKED(store, state, player, this)) {
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
        state = store.reduceEffect(state, checkProvidedEnergy);

        if (checkProvidedEnergy.energyMap.length === 0) {
          effect.cost = [];
        }
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new DiscardEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],// Card source is target Pokemon
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { min: 0, max: 5, allowCancel: false }
      ), energy => {

        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        state = store.reduceEffect(state, discardEnergy);
        effect.damage = 70 * cards.length;
        return state;
      });
    }
    return state;
  }
}
