import { PokemonCard, Stage, CardType, StoreLike, State, PlayerType, CardTag } from '../../game';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class VenusaurVMAX extends PokemonCard {

  public stage: Stage = Stage.VMAX;

  public tags = [CardTag.POKEMON_VMAX];

  public cardType: CardType = CardType.GRASS;

  public evolvesFrom = 'Venusaur V';

  public weakness = [{ type: CardType.FIRE }];

  public hp: number = 330;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Forest Storm',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'This attack does 30 damage for each [G] Energy attached to all of your Pokémon.'
    },
    {
      name: 'G-Max Bloom',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 210,
      text: 'Heal 30 damage from this Pokémon.'
    }
  ];

  public set: string = 'SWSH';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '102';

  public name: string = 'Venusaur VMAX';

  public fullName: string = 'Venusaur VMAX SWSH 102';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);

        let grassEnergy = 0;
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
          energy.provides.forEach(c => {
            grassEnergy += c === CardType.GRASS ? 1 : 0;
          });
        });

        effect.damage += 30 * grassEnergy;
        return state;
      });

      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        const player = effect.player;

        const healTargetEffect = new HealTargetEffect(effect, 30);
        healTargetEffect.target = player.active;
        state = store.reduceEffect(state, healTargetEffect);
      }
      return state;
    }
    return state;
  }
}
