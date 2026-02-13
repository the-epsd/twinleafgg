import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Eelektrik extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tynamo';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Headbutt',
      cost: [C],
      damage: 20,
      text: ''
    },
    {
      name: 'Shock Bolt',
      cost: [L, L, C],
      damage: 80,
      text: 'Discard all [L] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Eelektrik';
  public fullName: string = 'Eelektrik DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Headbutt - vanilla attack, no effect needed

    // Shock Bolt - discard all Lightning energy
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const lightningEnergy = player.active.cards.filter(card =>
        card.superType === SuperType.ENERGY &&
        card.energyType === EnergyType.BASIC &&
        (card as EnergyCard).provides.includes(CardType.LIGHTNING)
      );

      if (lightningEnergy.length > 0) {
        const discardEffect = new DiscardCardsEffect(effect, lightningEnergy);
        store.reduceEffect(state, discardEffect);
      }
    }

    return state;
  }
}
