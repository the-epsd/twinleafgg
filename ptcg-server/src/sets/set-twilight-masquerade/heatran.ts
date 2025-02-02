import { Card, GamePhase, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AfterDamageEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Heatran extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.METAL;
  public hp: number = 140;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), the Attacking Pokémon is now Burned.',
    useWhenInPlay: false,
    name: 'Incandescent Body'
  }];

  public attacks = [{
    name: 'Steel Burst',
    cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
    damage: 50,
    damageCalculation: 'x',
    text: 'Discard all [M] Energy from this Pokémon. This attack does 50 damage for each card you discarded in this way.'
  }];

  public set: string = 'TWM';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '123';
  public name: string = 'Heatran';
  public fullName: string = 'Heatran TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      let totalDiscarded = 0;

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;

      totalDiscarded += discardEnergy.cards.length;

      store.reduceEffect(state, discardEnergy);

      effect.damage += (totalDiscarded - 1) * 50;
    }

    if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (state.phase === GamePhase.ATTACK) {
        effect.source.addSpecialCondition(SpecialCondition.BURNED);
      }
    }

    return state;
  }
}