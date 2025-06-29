import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Gorebyss extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Clamperl';
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [];

  public attacks = [{
    name: 'Stun Needle',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Mystic Water',
    cost: [W, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Does 20 damage plus 10 more damage for each [P] Energy in play.'
  }];

  public set: string = 'HL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Gorebyss';
  public fullName: string = 'Gorebyss HL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      let energyCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const playerCheckProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, playerCheckProvidedEnergyEffect);

        playerCheckProvidedEnergyEffect.energyMap.forEach(em => {
          energyCount += em.provides.filter(cardType => {
            return cardType === CardType.PSYCHIC || cardType === CardType.ANY;
          }).length;
        });
      });

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        const oppCheckProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent, cardList);
        store.reduceEffect(state, oppCheckProvidedEnergyEffect);

        oppCheckProvidedEnergyEffect.energyMap.forEach(em => {
          energyCount += em.provides.filter(cardType => {
            return cardType === CardType.PSYCHIC || cardType === CardType.ANY;
          }).length;
        });
      });

      effect.damage += energyCount * 10;
    }

    return state;
  }
}

