import { Attack, CardTag, CardType, EnergyCard, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class PalkiaEX extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags: string[] = [CardTag.POKEMON_EX];
  public cardType: CardType = N;
  public hp: number = 180;
  public weakness: Weakness[] = [{ type: N }];
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [
    {
      name: 'Strafe',
      cost: [C, C, C],
      damage: 50,
      text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
    },
    {
      name: 'Dimension Heal',
      cost: [G, W, C, C],
      damage: 80,
      text: 'Heal from this Pokémon 20 damage for each Plasma Energy attached to this Pokémon.',
    },
  ];

  public set: string = 'PLB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Palkia EX';
  public fullName: string = 'Palkia EX PLB';

  public usedStrafe = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedStrafe = true;
    }

    if (AFTER_ATTACK(effect) && this.usedStrafe) {
      const player = effect.player;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      this.usedStrafe = false;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const pokemon = player.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);

      let totalPlasmaEnergy = 0;
      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard && energyCard.name === 'Plasma Energy') {
          totalPlasmaEnergy += 1;
        }
      });

      const healEffect = new HealEffect(player, player.active, 20 * totalPlasmaEnergy);
      store.reduceEffect(state, healEffect);
    }

    return state;
  }
}