import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, EnergyCard, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gardevoir extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kirlia';

  public cardType: CardType = P;

  public hp: number = 110;

  public weakness = [{ type: P }];

  public retreat = [C, C];

  public powers = [{
    name: 'Psychic Mirage',
    powerType: PowerType.ABILITY,
    text: 'Each basic [P] Energy attached to your [P] Pokémon provides [P][P] Energy. You can\'t apply more than 1 Psychic Mirage Ability at a time.'
  }];

  public attacks = [
    {
      name: 'Mind Shock',
      cost: [P, P, C, C],
      damage: 60,
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.',
    }
  ];

  public set: string = 'NXD';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '57';

  public name: string = 'Gardevoir';

  public fullName: string = 'Gardevoir NXD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
    }

    if (effect instanceof CheckProvidedEnergyEffect) {
      const player = effect.player;

      let hasGardevoirInPlay = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasGardevoirInPlay = true;
        }
      });

      if (!hasGardevoirInPlay) {
        return state;
      }

      if (hasGardevoirInPlay) {

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

        effect.source.cards.forEach(c => {
          if (c instanceof EnergyCard && !effect.energyMap.some(e => e.card === c)) {
            const providedTypes = c.provides.filter(type => type === CardType.PSYCHIC);
            if (providedTypes.length > 0) {
              effect.energyMap.push({ card: c, provides: [CardType.PSYCHIC, CardType.PSYCHIC] });
            }
          }
        });
        return state;
      }
      return state;
    }
    return state;
  }
}