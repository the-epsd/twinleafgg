import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, EnergyCard, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Galvantula extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Joltik';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Compound Eyes',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon\'s attacks do 50 more damage to your opponent\'s Active Pokémon that have an Ability.'
  }];

  public attacks = [{
    name: 'Shocking Web',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 50,
    text: 'If this Pokémon has any [L] Energy attached, this attack does 80 more damage.'
  }];

  public regulationMark = 'H';

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '2';

  public name: string = 'Galvantula';

  public fullName: string = 'Galvantula SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();

      // Try to reduce PowerEffect, to check if something is blocking our ability
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

      if (opponentActive && opponentActive.powers.length > 0) {
        effect.damage += 50;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const pokemon = player.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);

      let damage = 50;

      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard && energyCard.provides.includes(CardType.LIGHTNING)) {
          damage += 80;
        }
      });

      effect.damage = damage;

    }
    return state;
  }
}