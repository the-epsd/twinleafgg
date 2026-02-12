import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Emboar2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Pignite';
  public cardType: CardType = R;
  public hp: number = 150;
  public weakness = [{ type: W }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Heat Crash',
      cost: [R, C, C],
      damage: 50,
      text: ''
    },
    {
      name: 'Flare Blitz',
      cost: [R, R, C, C],
      damage: 150,
      text: 'Discard all [R] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Emboar';
  public fullName: string = 'Emboar BLW 19';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Discard all Fire Energy attached to this Pokémon
      const fireEnergies = player.active.cards.filter(c =>
        c instanceof EnergyCard && c.provides.includes(CardType.FIRE)
      );

      const discardEnergy = new DiscardCardsEffect(effect, fireEnergies);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
    }

    return state;
  }
}
