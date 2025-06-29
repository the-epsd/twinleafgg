import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';
import { PlayerType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Gardevoirex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Kirlia';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 150;
  public weakness = [{ type: G }, { type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Feedback',
    cost: [P, C],
    damage: 0,
    text: 'Count the number of cards in your opponent\'s hand. Put that many damage counters on the Defending Pokémon.'
  },
  {
    name: 'Psystorm',
    cost: [P, C, C, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the total amount of Energy attached to all Pokémon in play.'
  }];

  public set: string = 'SS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Gardevoir ex';
  public fullName: string = 'Gardevoir ex SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(effect.opponent.hand.cards.length, store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      let energies = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
          energies += 1;
        });
      });

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
          energies += 1;
        });
      });

      effect.damage = energies * 10;
    }

    return state;
  }
}