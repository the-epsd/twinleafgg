import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PowerEffect } from '../../../game/store/effects/game-effects';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { TERA_RULE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Espathraex extends PokemonCard {
  protected _tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Flittle';
  public cardType: CardType[] = [G];
  public hp: number = 260;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [
    {
      name: 'Dazzling Gaze',
      powerType: PowerType.ABILITY,
      text: "As long as this Pokémon is in the Active Spot, attacks used by your opponent's Active Pokémon cost [C] more.",
    },
  ];

  public attacks = [{
    name: 'Psy Ball',
    cost: [P],
    damage: 30,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each Energy attached to both Active Pokémon.'
  }];

  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public set = 'PAF';
  public name: string = 'Espathra ex';
  public fullName: string = 'Espathra ex PAF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dazzling Gaze
    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      // Check if Espathra ex is in the active position
      if (owner.active.getPokemonCard() === this) {
        try {
          const stub = new PowerEffect(
            player,
            {
              name: 'test',
              powerType: PowerType.ABILITY,
              text: '',
            },
            this,
          );
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        if (player !== owner && player.active.getPokemonCard()) {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index > -1) {
            effect.cost.splice(index, 0, CardType.COLORLESS);
          } else {
            effect.cost.push(CardType.COLORLESS);
          }
        }
        return state;
      }
    }
    // Psy Ball
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, playerProvidedEnergy);
      const playerEnergyCount = playerProvidedEnergy.energyMap.reduce(
        (left, p) => left + p.provides.length,
        0,
      );

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap.reduce(
        (left, p) => left + p.provides.length,
        0,
      );

      effect.damage += (playerEnergyCount + opponentEnergyCount) * 30;
    }

    TERA_RULE(effect, state, this);

    return state;
  }
}
