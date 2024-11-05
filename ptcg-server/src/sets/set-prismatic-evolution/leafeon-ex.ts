import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { HealTargetEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Leafeonex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardType: CardType = G;

  public hp: number = 270;

  public weakness = [{ type: R }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Leaf Typhoon',
      cost: [G, C],
      damage: 60,
      text: 'This attack foes 60 damage for each Energy attached to all of your opponent\'s Pokémon.'
    },
    {
      name: 'Moss Agate',
      cost: [G, R, W],
      damage: 230,
      text: 'Heal 100 damage from each of your Benched Pokemon.'
    }
  ];

  public regulationMark: string = 'H';
  public set: string = 'SV8a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Leafeon ex';
  public fullName: string = 'Leafeon ex SV8a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psybeam
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energies = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
          energies++;
        });
      });

      effect.damage = energies * 60;
    }

    // Psychic
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        const healTargetEffect = new HealTargetEffect(effect, 100);
        healTargetEffect.target = cardList;
        state = store.reduceEffect(state, healTargetEffect);
      });
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Target is this Pokemon
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}