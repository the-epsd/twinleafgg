import { Attack, CardTag, CardType, PokemonCard, Stage, State, StoreLike, SuperType, Weakness } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AFTER_ATTACK, CONFIRMATION_PROMPT, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class PalkiaEX extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags: string[] = [CardTag.POKEMON_EX, CardTag.TEAM_PLASMA];
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
  public name: string = 'Palkia-EX';
  public fullName: string = 'Palkia EX PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (hasBenched) {
        CONFIRMATION_PROMPT(store, state, player, result => {
          if (result) {
            SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
          }
        });
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const pokemon = player.active;

      const checkEnergy = new CheckProvidedEnergyEffect(player, pokemon);
      store.reduceEffect(state, checkEnergy);

      let totalPlasmaEnergy = 0;
      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard.superType === SuperType.ENERGY && energyCard.name === 'Plasma Energy') {
          totalPlasmaEnergy += 1;
        }
      });

      const healEffect = new HealEffect(player, player.active, 20 * totalPlasmaEnergy);
      store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
